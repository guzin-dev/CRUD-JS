//Nome (Tela login/cadastro)
const nome = document.getElementById('nome-input')
//CPF (Tela login/cadastro)
const cpf = document.getElementById('cpf-input')
//Senha (Tela login/cadastro)
const senha = document.getElementById('senha-input')
//Lista de contas (Tela admin)
const lista = document.getElementById('drop-down')
//Botão excluir conta (Tela admin)
const btn_exConta = document.getElementById('btn_exConta')

//Funções extras

function temLetra(str) {
  return /[a-zA-Z]/.test(str);
}

function formataCpf(){
  let inputLength = cpf.value.length

  if(inputLength === 3 || inputLength === 7){
    cpf.value += '.'
  } else if(inputLength === 11){
    cpf.value += '-'
  }
}

function removeLogou(){
  for(let i = 0; i < localStorage.length; i++){
    if(localStorage.key(i).startsWith('logou')){
      const conta = JSON.parse(localStorage.getItem(localStorage.key(i)))
      localStorage.setItem(conta.cpf, localStorage.getItem(localStorage.key(i)))
      localStorage.removeItem(`logou${conta.cpf}`)
    }
  }
}

function verificaLogou(){
  let achou = false
  for(let i = 0; i < localStorage.length; i++){
    if(localStorage.key(i).startsWith('logou')){
      const conta = JSON.parse(localStorage.getItem(localStorage.key(i)))
      nome.value = conta.nome
      cpf.value = conta.cpf
      senha.value = conta.senha
      achou = true
    }
  }
  if(achou == false){
    alert('Entre em alguma conta antes de utilizar esta página!')
    window.location.href = "./login.html"
  }
}

function carregarLista(){
  for(let i = 0; i < localStorage.length; i++){
    if(localStorage.key(i) != 'loglevel'){
      let conta = JSON.parse(localStorage.getItem(localStorage.key(i)))
      const option = document.createElement('option')
      const optionText = document.createTextNode(`Nome: ${conta.nome}, CPF: ${conta.cpf}`)
      option.value = conta.cpf
      option.appendChild(optionText)
      lista.appendChild(option)
    }
  }
}

//Funções do CRUD

function criarConta(){
  if(!(nome.value.match(/^(\s)+$/) || nome.value == "" || cpf.value.match(/^(\s)+$/) || cpf.value == "" || cpf.value.length < 14 || temLetra(cpf.value) == true || senha.value.match(/^(\s)+$/) || senha.value == "")){
    for(let i = 0; i < localStorage.length+1; i++){
      if(localStorage.key(i) == cpf.value || cpf.value == '000.000.000-00'){
        alert('CPF já cadastrado!')
        cpf.value = ''
        senha.value = ''
        i = localStorage.length
      } else if(localStorage.key(i) == null) {
        let conta = {nome: nome.value, cpf: cpf.value, senha: senha.value}
        let contaSerialized = JSON.stringify(conta)
        localStorage.setItem(cpf.value, contaSerialized)
        alert('Conta criada com sucesso!')
        nome.value = ''
        cpf.value = ''
        senha.value = ''
        i = localStorage.length
      }
    }
  } else {
    alert('Por favor, verifique se todos os campos estão preenchidos corretamente!')
  }
}

function entrarConta(){
  let encontrou = false
  if(!(cpf.value.match(/^(\s)+$/) || cpf.value == "" || cpf.value.length < 14 || temLetra(cpf.value) == true || senha.value.match(/^(\s)+$/) || senha.value == "")){
    if(cpf.value == '000.000.000-00' && senha.value == 'admin'){
      window.location.href = "./admin.html"
    } else {
      for(let i = 0; i < localStorage.length; i++){
        if(localStorage.key(i) != 'loglevel'){
          let conta = JSON.parse(localStorage.getItem(localStorage.key(i)))
          if(conta.cpf == cpf.value && conta.senha == senha.value){
            encontrou = true
            let contaSerialized = JSON.stringify(conta)
            localStorage.setItem(`logou${cpf.value}`, contaSerialized)
            localStorage.removeItem(cpf.value)
            window.location.href = "./conta.html"
          }
        }
      }
      if(encontrou == false){
        alert('Conta não encontrada! Tente novamente')
      }
    }
  } else {
    alert('Por favor, verifique se todos os campos estão preenchidos corretamente!')
  }
}

function selecionarConta(sel){
  if(sel.options[sel.selectedIndex].value != 'none'){
    btn_exConta.classList.remove('esconder')
    return sel.options[sel.selectedIndex].value
  } else {
    btn_exConta.classList.add('esconder')
  }
}

function excluirConta(){
  localStorage.removeItem(selecionarConta(lista))
  window.location.reload()
}

function editarConta(tipo) {
  let conta
  for(let i = 0; i < localStorage.length; i++){
    if(localStorage.key(i).startsWith('logou')){
      conta = JSON.parse(localStorage.getItem(localStorage.key(i)))
    }
  }
  if(tipo == 'nome'){
    if(!(nome.value.match(/^(\s)+$/) || nome.value == "")){
      conta.nome = nome.value
      const contaSerialized = JSON.stringify(conta)
      localStorage.setItem(`logou${conta.cpf}`, contaSerialized)
    } else {
      alert('O nome inserido é inválido!')
    }
  } else if (tipo == 'cpf') {
    if(!(cpf.value.match(/^(\s)+$/) || cpf.value == "" || cpf.value.length < 14 || temLetra(cpf.value) == true)){
      for(let i = 0; i < localStorage.length; i++){
        if(localStorage.key(i) == cpf.value || cpf.value == '000.000.000-00'){
          alert('CPF já cadastrado!')
          i = localStorage.length
        } else {
          localStorage.removeItem(`logou${conta.cpf}`)
          conta.cpf = cpf.value
          const contaSerialized = JSON.stringify(conta)
          localStorage.setItem(`logou${conta.cpf}`, contaSerialized)
        }
      }
    }
  } else if(tipo == 'senha') {
    if(!(senha.value.match(/^(\s)+$/) || senha.value == "")){
      conta.senha = senha.value
      const contaSerialized = JSON.stringify(conta)
      localStorage.setItem(`logou${conta.cpf}`, contaSerialized)
    } else {
      alert('A senha inserida é inválida!')
    }
  }
}