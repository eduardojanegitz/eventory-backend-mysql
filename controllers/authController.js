import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Usuário e senha são obrigatórios" });
  }

  try {
    const [rows] = await db.query('SELECT * FROM GLO_USUARIOS WHERE USUARIO_ST_ALTERNATIVO = ?', [username]);
    const foundUser = rows[0];

    if (!foundUser || !foundUser.USUARIO_CH_ATIVO) {
      return res.status(401).json({ message: "Usuário ou senha incorretos" });
    }

    const match = await bcrypt.compare(password, foundUser.USUARIO_ST_SENHA);

    if (!match) {
      return res.status(401).json({ message: "Usuário ou senha incorretos" });
    }

    const roles = foundUser.USUARIO_ST_PERMISSAO;
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.USUARIO_ST_ALTERNATIVO,
          roles: foundUser.USUARIO_ST_PERMISSAO,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    
    const refreshToken = jwt.sign(
      { username: foundUser.USUARIO_ST_ALTERNATIVO },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Criar cookie seguro com refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true, // acessível apenas pelo servidor web
      secure: true, // https
      sameSite: "None", // cookie entre sites
      maxAge: 7 * 24 * 60 * 60 * 1000, // expiração do cookie: configurada para coincidir com o refreshToken
    });

    // Enviar accessToken contendo nome de usuário e papéis
    res.json({ accessToken, roles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Não autorizado" });

  const refreshToken = cookies.jwt;

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Proibido" });

    const [rows] = await db.query('SELECT * FROM GLO_USUARIOS WHERE USUARIO_ST_ALTERNATIVO = ?', [decoded.username]);
    const foundUser = rows[0];

    if (!foundUser) return res.status(401).json({ message: "Não autorizado" });

    const roles = foundUser.USUARIO_ST_PERMISSAO;
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.USUARIO_ST_ALTERNATIVO,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken, roles });
  });
};

export const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // Sem conteúdo
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie removido" });
};

export const logged = (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.json(false);

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    res.send(true);
  } catch (error) {
    res.json(false);
  }
};
