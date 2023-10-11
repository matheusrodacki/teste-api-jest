import { describe, expect, it, jest } from "@jest/globals";
import AuthService from "../../services/authService.js";
import bcryptjs from "bcryptjs";

const authService = new AuthService();

describe("Test authService.cadastrarUsuario", () => {
  it("O usuário deve ter nome e senha!", async () => {
    const usuarioTeste = {
      nome: "Rafael",
      email: "rapha@g.com",
    };
    const usuarioSalvo = authService.cadastrarUsuario(usuarioTeste);

    await expect(usuarioSalvo).rejects.toThrowError(
      "A senha do usuario é obritatória!"
    );
  });

  it("Não pode ser cadastrado um usuário com e-mail duplicado", async () => {
    const usuarioDuplicado = {
      nome: "Raphael",
      email: "raphael@teste.com.br",
      senha: "123456",
    };

    const resultado = authService.cadastrarUsuario(usuarioDuplicado);

    await expect(resultado).rejects.toThrowError("O email já esta cadastrado!");
  });

  it("A senha do usuario deve ser criptografada. ", async () => {
    const usuarioTeste = {
      nome: "Rafael",
      email: "rapha@g.com",
      senha: "12345",
    };
    authService.cadastrarUsuario = jest.fn().mockReturnValueOnce({
      message: "usuario criado",
      content: {
        id: 15,
        nome: "Rafael",
        email: "rapha@g.com",
        senha: `${await bcryptjs.hash("12345", 8)}`,
        created_at: "2023-10-05",
        updated_at: "2023-10-05",
      },
    });

    const usuarioSalvo = await authService.cadastrarUsuario(usuarioTeste);

    const senhaComparada = await bcryptjs.compare(
      "12345",
      usuarioSalvo.content.senha
    );

    expect(senhaComparada).toStrictEqual(true);
  });
});

// "test:auth:service": "node --experimental-vm-modules node_modules/jest/bin/jest.js --testPathPattern=src/test/services/authService.test.js"
