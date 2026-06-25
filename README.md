# Wangola - Equipe 55

Aplicação Java Spring Boot com arquitetura de monolito modular.

## Pipeline AppSec

Pipeline de segurança automatizado rodando no GitHub Actions:

| Etapa | Ferramenta | Objetivo |
|-------|-----------|----------|
| SAST | SpotBugs + Find Security Bugs | Análise estática de vulnerabilidades no código-fonte |
| Detecção de Segredos | Gitleaks | Impede que credenciais e segredos sejam commitados |
| SCA | OWASP Dependency-Check | Identifica CVEs conhecidas em dependências de terceiros |
| Segurança de Containers | Trivy | Escaneia imagens Docker em busca de vulnerabilidades |
| DAST | OWASP ZAP | Testes dinâmicos contra a aplicação em execução |
| Scan de Filesystem | Trivy FS | Verifica arquivos de IaC e configuração por falhas |

O pipeline é acionado a cada push nas branches `main`/`develop` e em pull requests para `main`.
