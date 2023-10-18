import { describe, expect, it, jest } from "@jest/globals";
import AuthService from "../../services/authService.js";
import Usuario from "../../models/usuario.js";
import bcryptjs from "bcryptjs";

const authService = new AuthService();

describe("Test authService.cadastrarUsuario", () => {
  it("O usuário deve ter nome e senha!", async () => {
    const usuarioSemSenha = {
      nome: "Rafael",
      email: "rapha@g.com",
    };
    const usuarioSalvo = authService.cadastrarUsuario(usuarioSemSenha);

    await expect(usuarioSalvo).rejects.toThrowError(
      "A senha do usuario é obritatória!"
    );
  });

  it("A senha do usuario deve ser criptografada. ", async () => {
    const usuarioTeste = {
      nome: "John Doe",
      email: "johndoe@example.com",
      senha: "senha123",
    };

    const usuarioSalvo = await authService.cadastrarUsuario(usuarioTeste);

    const senhaComparada = await bcryptjs.compare(
      "senha123",
      usuarioSalvo.content.senha
    );

    expect(senhaComparada).toStrictEqual(true);

    await Usuario.excluir(usuarioSalvo.content.id);
  });

  it("Não pode ser cadastrado um usuário com e-mail duplicado", async () => {
    const usuarioTeste = {
      nome: "Raphael",
      email: "raphael@teste.com.br",
      senha: "123456",
    };
    const usuarioSalvo = authService.cadastrarUsuario(usuarioTeste);

    await expect(usuarioSalvo).rejects.toThrowError(
      "O email já esta cadastrado!"
    );
  });

  it("Deve ser retornada uma mensagem informando que o cadastro foi realizado;", async () => {
    const usuarioTeste = {
      nome: "John Doe",
      email: "johndoe@example.com",
      senha: "senha123",
    };
    const usuarioSalvo = await authService.cadastrarUsuario(usuarioTeste);

    expect(usuarioSalvo.message).toEqual("usuario criado");
    await Usuario.excluir(usuarioSalvo.content.id);
  });
  it("Deve restornar os dados cadastrados", async () => {
    const usuarioTeste = {
      nome: "John Doe",
      email: "johndoe@example.com",
      senha: "senha123",
    };
    const usuarioSalvo = await authService.cadastrarUsuario(usuarioTeste);

    expect(usuarioSalvo).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        content: expect.objectContaining({
          id: expect.any(Number),
          ...usuarioTeste,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        }),
      })
    );
    await Usuario.excluir(usuarioSalvo.content.id);
  });
});

// "test:auth:service": "node --experimental-vm-modules node_modules/jest/bin/jest.js --testPathPattern=src/test/services/authService.test.js"
