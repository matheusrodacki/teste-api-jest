import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import Usuario from "../models/usuario.js";
import constants from "../config/constants.js";

class AuthService {
  async login(data) {
    try {
      if (!data.email) {
        throw new Error("O email do usuario é obrigatório.");
      }

      if (!data.senha) {
        throw new Error("A senha de usuário é obrigatório.");
      }

      const usuario = await Usuario.pegarPeloEmail(data.email);

      if (!usuario) {
        throw new Error("Usuário não cadastrado.");
      }

      const senhaIguais = await bcryptjs.compare(data.senha, usuario.senha);

      if (!senhaIguais) {
        throw new Error("Usuário ou senha invalido.");
      }

      const accessToken = jsonwebtoken.sign(
        {
          id: usuario.id,
          email: usuario.email,
        },
        constants.jsonSecret,
        {
          expiresIn: 86400,
        }
      );

      return { message: "Usuário conectado", accessToken };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async cadastrarUsuario(data) {
    //verifica se a asenha foi digitada
    if (!data.senha) {
      throw new Error("A senha do usuario é obritatória!");
    }
    data.senha = await bcryptjs.hash(data.senha, 8);

    //verifica se o email já existe no db
    const emailCadastrado = await Usuario.pegarPeloEmail(data.email);
    if (emailCadastrado) {
      throw new Error("O email já esta cadastrado!");
    }
    const usuario = new Usuario(data);
    try {
      const resposta = await usuario.salvar(usuario);
      return { message: "usuario criado", content: resposta };
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

export default AuthService;
