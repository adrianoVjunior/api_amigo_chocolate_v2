# amigo-chocolate (C) 
Antes de iniciar, realize as configurações a seguir para o total funcionamento da API.

### Comandos iniciais
Na pasta root (raiz, a mesma em que o **package.json** está) do projeto, realize o seguinte comando no terminal
```
npm install
```
> Dica: Para abrir o terminal no VS Code utilize CTRL + '. É muito mais fácil executar os comandos por lá.

### Environment keys

Crie o arquivo **.env.json** na pasta root do projeto . Nela, adicione as seguintes informações: 
```
{
"connectionString":  "mongodb+srv://...",
"JWT_KEY":  "CHAVE PARA AUTENTICAÇÃO"
}
```

Onde:
 * **connectionString** -> a sua connection string do mongodb que será utilizada.
 * **JWT_KEY** -> A chave para a autenticação da aplicação. *Pode ser qualquer coisa!* 
> Essas chaves são utilizadas pelo módulo env-cmd.

### Collection do Postman
Para facilitar nas requisições, a *collection* do projeto no [postman](https://www.postman.com/downloads/) está presente na pasta [readme_files](./readme_files). Importe ela antes de seguir para o próximo passo.


### Iniciando a API
Realize o comando a seguir para iniciar a API. Certifique-se de ter realizado corretamente os passos anteriores.
```
npm run dev
```

Caso tenha sucesso, a seguinte mensagem será exibida no terminal:
```
Aplicação rodando na porta 3333!
```
