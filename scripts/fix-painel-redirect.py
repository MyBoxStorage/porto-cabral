import sys

path = r'C:\Users\pc\Desktop\Projetos\portocabralatual\app\[locale]\painel\login\page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

old = """    try {
      const result = await signIn('credentials', { email, password, redirect: false })
      console.log('[painel-login] result:', JSON.stringify(result))
      if (!result) {
        setError('Sem resposta do servidor. Tente novamente.')
        setLoading(false)
        return
      }
      if (result.error) {
        setError(`Erro: ${result.error}`)
        setLoading(false)
        return
      }
      // Redireciona para o painel — o Server Component verifica se eh admin
      router.push(`/${locale}/painel`)
      router.refresh()
    } catch (err) {
      console.error('[painel-login] excecao:', err)
      setError('Erro inesperado. Verifique o console.')
      setLoading(false)
    }"""

new = """    try {
      const result = await signIn('credentials', { email, password, redirect: false })
      if (!result) {
        setError('Sem resposta do servidor. Tente novamente.')
        setLoading(false)
        return
      }
      if (result.error) {
        setError('Email ou senha invalidos.')
        setLoading(false)
        return
      }
      // Navegacao completa para garantir que a sessao seja lida pelo servidor
      window.location.href = `/${locale}/painel`
    } catch (err) {
      console.error('[painel-login] excecao:', err)
      setError('Erro inesperado. Tente novamente.')
      setLoading(false)
    }"""

if old in content:
    content = content.replace(old, new, 1)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('OK: redirect corrigido para window.location.href')
else:
    print('ERRO: padrao nao encontrado')
    sys.exit(1)
