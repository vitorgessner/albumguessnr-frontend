import { useEffect, useState } from 'react';

export const PrivacyPolicy = () => {
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        document.title = 'Privacy policy';
    }, []);

    return (
        <div className="max-w-195 m-auto pt-10 pb-20 px-6 leading-[1.65] text-[#1f2328]">
            <h1 className="text-3xl mb-0.5">Política de Privacidade / Privacy Policy</h1>
            <p className="text-[#57606a] text-base">AlbumGuessnr</p>
            <p className="text-[#57606a] text-base mb-8">{language === 'pt-BR' ? 'Última atualização: 20 de outubro de 2026.' : 'Last updated: October 20, 2026.'}</p>

            <div className="sticky top-0 bg-cream py-3 px-0 mb-6 border-b border-b-primary z-10">
                <button
                    id="btn-pt"
                    className={`text-sm py-1.5 px-4 mr-2 border border-primary rounded-md cursor-pointer ${language === 'pt-BR' ? 'sage-component' : 'primary-component'}`}
                    onClick={() => setLanguage('pt-BR')}
                >
                    {language === 'pt-BR' ? 'Português' : 'Portuguese'}
                </button>
                <button
                    id="btn-en"
                    onClick={() => setLanguage('en')}
                    className={`text-sm py-1.5 px-4 mr-2 border border-primary rounded-md cursor-pointer ${language === 'en' ? 'sage-component' : 'primary-component'}`}
                >
                    {language === 'pt-BR' ? 'Inglês' : 'English'}
                </button>
            </div>

            {language === 'pt-BR' && (
                <section id="lang-pt">
                    <h2 className="text-xl mt-9 border-b border-b-primary pb-1">
                        Quem somos
                    </h2>
                    <p className="my-3 mx-0">
                        O AlbumGuessnr é um projeto de graduação (trabalho acadêmico) desenvolvido por Vitor Gabriel Gessner, estudante de Sistemas para Internet na UNIVALI (Universidade do Vale do Itajaí), que atua como controlador dos dados pessoais tratados neste site. Contato para assuntos de privacidade: albumguessnr@gmail.com.
                    </p>
                    <h2 className="text-xl mt-9 border-b border-b-primary pb-1">
                        Dados que coletamos
                    </h2>
                    <ul className="my-3 mx-0 ml-7 list-disc">
                        <li className='my-3 mx-0'><b>Conta</b>: e-mail, nome de usuário e senha (armazenada de forma protegida, nunca em texto puro). Se você entrar com Google, Spotify ou Last.fm, recebemos os dados que você autorizar nesses serviços (item 4).</li>
                        <li className='my-3 mx-0'><b>Jogador convidado</b>: se você joga o álbum diário sem criar conta, criamos um perfil de convidado ligado ao seu navegador para guardar seu progresso (histórico e sequência de dias). Se depois você criar uma conta, esse histórico pode ser mantido nela.</li>
                        <li className='my-3 mx-0'><b>Dados de jogo e atividade</b>: palpites, tentativas, acertos, resultados, sequências e os dias em que você acessou o sistema.</li>
                        <li className='my-3 mx-0'><b>Perfil público</b>: seu nome de usuário, informações de perfil e estatísticas de jogo podem ser exibidos publicamente na sua página de perfil e nos rankings.</li>
                        <li className='my-3 mx-0'><b>Análise de uso (somente com seu consentimento)</b>: páginas visitadas, tempo nas telas, interações, origem do acesso, dispositivo, navegador e localização aproximada, coletados pelo Google Analytics. Contamos, de forma agregada e sem identificar você, quantas sessões têm a análise de uso bloqueada por extensões do navegador.</li>
                        <li className='my-3 mx-0'><b>Dados técnicos</b>: nossos provedores de hospedagem podem tratar dados como endereço IP e registros de acesso para operação e segurança do serviço.</li>
                    </ul>

                    <h2 className="text-xl mt-9 border-b border-b-primary pb-1">
                        Como usamos os seus dados
                    </h2>
                    <ul className="my-3 mx-0 ml-7 list-disc">
                        <li className='my-3 mx-0'>Prestar o serviço: autenticar você, executar o jogo, guardar seu progresso e montar rankings.</li>
                        <li className='my-3 mx-0'>Personalizar o jogo com a sua música, quando você conecta Spotify ou Last.fm.</li>
                        <li className='my-3 mx-0'><b>Pesquisa acadêmica</b>: estudar como o sistema é usado, por exemplo se o álbum diário incentiva os usuários a voltar. Os resultados são apresentados apenas de forma agregada e anonimizada.</li>
                        <li className='my-3 mx-0'>Manter a segurança e o bom funcionamento do site.</li>
                    </ul>
                    <p className='my-3 mx-0'>Tratamos seus dados para prestar o serviço que você solicita e, com o seu consentimento, para análise de uso e conexão com serviços de terceiros. Os dados de jogo e atividade também são usados na pesquisa acadêmica descrita acima.</p>

                    <h2 className="text-xl mt-9 border-b border-b-primary pb-1">
                        Compartilhamento e serviços de terceiros
                    </h2>

                    <p className='my-3 mx-0'>Não vendemos seus dados. Compartilhamos dados apenas com os serviços necessários ao funcionamento do site:</p>
                    <ul className="my-3 mx-0 ml-7 list-disc">
                        <li className='my-3 mx-0'><b>Google</b>: login com Google (e-mail e perfil básico) e Google Analytics (somente com consentimento).</li>
                        <li className='my-3 mx-0'><b>Spotify</b>: se você conectar sua conta, acessamos e-mail, dados de perfil, biblioteca salva e seus artistas e faixas mais ouvidos, conforme as permissões que você autorizar.</li>
                        <li className='my-3 mx-0'><b>Last.fm</b>: se você conectar sua conta, acessamos seu nome de usuário e os dados de escuta autorizados.</li>
                        <li className='my-3 mx-0'><b>Infraestrutura</b>: hospedagem do site (como a Vercel), hospedagem da API, banco de dados e armazenamento de arquivos (como o Supabase).</li>
                    </ul>
                    <p className='my-3 mx-0'>Cada serviço tem sua própria política de privacidade, sobre a qual não temos controle. Você pode revogar o acesso do AlbumGuessnr nas configurações da sua conta Google, Spotify ou Last.fm. Também podemos divulgar dados quando exigido por lei.</p>

                    <h2 className="text-xl mt-9 border-b border-b-primary pb-1">
                        Transferência internacional
                    </h2>
                    <p className='my-3 mx-0'>Nossos servidores e os de nossos provedores podem estar fora do Brasil (por exemplo, nos Estados Unidos), e o Google processa dados em escala global. Ao usar o serviço, seus dados podem ser transferidos para esses locais.</p>

                    <h2 className="text-xl mt-9 border-b border-b-primary pb-1">
                        Retenção
                    </h2>
                    <p className='my-3 mx-0'>Mantemos dados de conta e de jogo enquanto sua conta (ou perfil de convidado) existir e for necessário para o serviço e para a pesquisa. Os dados do Google Analytics seguem o período de retenção configurado em nossa propriedade. Você pode pedir a exclusão dos seus dados a qualquer momento (item 7). Resultados de pesquisa já anonimizados e agregados podem ser mantidos.</p>

                    <h2 className="text-xl mt-9 border-b border-b-primary pb-1">
                        Seus direitos
                    </h2>
                    <p className='my-3 mx-0'>Conforme a LGPD, você pode solicitar confirmação do tratamento, acesso, correção, anonimização ou exclusão, portabilidade, informações sobre compartilhamento e revogação do consentimento. Escreva para albumguessnr@gmail.com. Você também pode revogar o consentimento de análise de uso pelas configurações de cookies do site.</p>

                    <h2 className="text-xl mt-9 border-b border-b-primary pb-1">
                        Segurança, links externos e alterações
                    </h2>
                    <p className='my-3 mx-0'>Protegemos os dados por meios comercialmente aceitáveis contra perda, roubo e acesso, divulgação, cópia, uso ou modificação não autorizados. O site pode conter links para sites externos que não operamos, e não nos responsabilizamos por suas políticas. Você é livre para recusar fornecer dados pessoais, entendendo que alguns serviços podem ficar indisponíveis. Podemos atualizar esta política; a data da última atualização fica no topo. Ao criar uma conta ou continuar usando o serviço, você reconhece esta política; a análise de uso só é ativada com o seu consentimento explícito.</p>

                    <h2 className="text-xl mt-9 border-b border-b-primary pb-1">
                        Política de cookies
                    </h2>
                    <p className='my-3 mx-0'>Esta é a Política de Cookies do AlbumGuessnr, acessível em <a href='albumguessnr.com'>albumguessnr.com</a>. Cookies são pequenos arquivos que o site grava no seu navegador para funcionar e para entender como é usado.</p>
                    <table className='border-collapse'>
                        <thead>
                            <tr>
                                <th>
                                    Cookie
                                </th>
                                <th>
                                    Origem
                                </th>
                                <th>
                                    Finalidade
                                </th>
                                <th>
                                    Duração
                                </th>
                                <th>
                                    Categoria
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    token
                                </td>
                                <td>
                                    api.albumguessnr.com
                                </td>
                                <td>
                                    Mantém você autenticado (conta ou convidado). Não é acessível por JavaScript.
                                </td>
                                <td>
                                    cerca de 1 hora
                                </td>
                                <td>
                                    Necessário
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    refresh
                                </td>
                                <td>
                                    api.albumguessnr.com
                                </td>
                                <td>
                                    Renova sua sessão automaticamente, sem novo login. Não é acessível por JavaScript.
                                </td>
                                <td>
                                    7 dias (contas) ou 30 dias (convidados), renovados a cada visita
                                </td>
                                <td>
                                    Necessário
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    cc_cookie
                                </td>
                                <td>
                                    albumguessnr.com
                                </td>
                                <td>
                                    Guarda suas escolhas sobre cookies.
                                </td>
                                <td>
                                    período limitado
                                </td>
                                <td>
                                    Necessário
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    _ga e {'_ga<ID>'}
                                </td>
                                <td>
                                    albumguessnr.com (Google Analytics)
                                </td>
                                <td>
                                    Distingue visitantes e sessões para estatísticas de uso, com finalidade acadêmica.
                                </td>
                                <td>
                                    até 2 anos
                                </td>
                                <td>
                                    Análise (só com consentimento)
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p className='my-3 mx-0'><b>Login por terceiros</b>. Ao entrar com Google, Spotify ou Last.fm, você é redirecionado ao site do provedor, que pode definir cookies nos próprios domínios, regidos pelas políticas deles. Não temos acesso nem controle sobre esses cookies.</p>
                    <p className='my-3 mx-0'><b>Gerenciando seus cookies</b>. Você pode alterar ou revogar sua escolha sobre cookies de análise a qualquer momento nas configurações de cookies do site. Ao revogar, apagamos os cookies do Google Analytics e recarregamos a página. Você também pode bloquear cookies no navegador, mas isso pode impedir o login e outras funcionalidades.</p>

                    <h2 className="text-xl mt-9 border-b border-b-primary pb-1">
                        Responsabilidades do usuário
                    </h2>
                    <p className='my-3 mx-0'>O usuário se compromete a usar o site de forma apropriada, o que inclui, sem limitação:</p>
                    <ul className="my-3 mx-0 ml-7 list-disc">
                        <li className='my-3 mx-0'>Não praticar atividades ilegais ou contrárias à boa-fé e à ordem pública;</li>
                        <li className='my-3 mx-0'>Não difundir conteúdo racista, xenofóbico, de jogos de azar, pornografia ilegal, apologia ao terrorismo ou contrário aos direitos humanos;</li>
                        <li className='my-3 mx-0'>Não causar danos aos sistemas do AlbumGuessnr, de seus fornecedores ou de terceiros, nem disseminar vírus ou outros códigos nocivos.</li>
                    </ul>
                </section>
            )}

            {language === 'en' && (
                <section id="lang-en" className="lang">
                    <h2 className="text-xl mt-9 border-b border-b-primary pb-1">
                        Who are we
                    </h2>
                    <p className="my-3 mx-0">
                        AlbumGuessnr is a university graduation project (academic work) developed by Vitor Gabriel Gessner, a student of Internet Systems at UNIVALI (Universidade do Vale do Itajaí), who acts as the controller of the personal data processed on this site. Privacy contact: albumguessnr@gmail.com.
                    </p>
                    <h2 className="text-xl mt-9 border-b border-b-primary pb-1">
                        Data we collect
                    </h2>
                    <ul className="my-3 mx-0 ml-7 list-disc">
                        <li className='my-3 mx-0'><b>Account</b>: email, username and password (stored in protected form, never in plain text). If you sign in with Google, Spotify or Last.fm, we receive the data you authorize on those services (item 4).</li>
                        <li className='my-3 mx-0'><b>Guest players</b>: if you play without creating an account, we create a guest profile tied to your browser to save your progress (history and daily streak). If you later create an account, that history may be kept in it.</li>
                        <li className='my-3 mx-0'><b>Gameplay and activity data</b>: guesses, attempts, correct answers, results, streaks and the days on which you accessed the system.</li>
                        <li className='my-3 mx-0'><b>Public profile</b>: your username, profile information and game statistics may be shown publicly on your profile page and on leaderboards.</li>
                        <li className='my-3 mx-0'><b>Usage analytics (only with your consent)</b>: pages visited, time on screens, interactions, traffic source, device, browser and approximate location, collected through Google Analytics. We count, in aggregate and without identifying you, how many sessions have usage analytics blocked by browser extensions.</li>
                        <li className='my-3 mx-0'><b>Technical data</b>: our hosting providers may process data such as IP address and access logs to operate and secure the service. </li>
                    </ul>

                    <h2 className="text-xl mt-9 border-b border-b-primary pb-1">
                        How we use your data
                    </h2>
                    <ul className="my-3 mx-0 ml-7 list-disc">
                        <li className='my-3 mx-0'>To provide the service: authenticate you, run the game, save your progress and build leaderboards.</li>
                        <li className='my-3 mx-0'>To personalize the game with your music when you connect Spotify or Last.fm.</li>
                        <li className='my-3 mx-0'><b>Academic research</b>: to study how the system is used, for example whether the daily album encourages users to come back. Results are presented only in aggregated and anonymized form.</li>
                        <li className='my-3 mx-0'>To keep the site secure and working properly.</li>
                    </ul>
                    <p className='my-3 mx-0'>We process your data to provide the service you request and, with your consent, for usage analytics and connections to third-party services. Gameplay and activity data are also used in the academic research described above.</p>

                    <h2 className="text-xl mt-9 border-b border-b-primary pb-1">
                        Sharing and third-party services
                    </h2>

                    <p className='my-3 mx-0'>We do not sell your data. We share data only with the services needed to run the site:</p>
                    <ul className="my-3 mx-0 ml-7 list-disc">
                        <li className='my-3 mx-0'><b>Google</b>: sign-in with Google (email and basic profile) and Google Analytics (only with consent).</li>
                        <li className='my-3 mx-0'><b>Spotify</b>: if you connect your account, we access your email, profile data, saved library and top artists and tracks, according to the permissions you grant.</li>
                        <li className='my-3 mx-0'><b>Last.fm</b>: if you connect your account, we access your username and the listening data you authorize.</li>
                        <li className='my-3 mx-0'><b>Infraestrutura</b>: site hosting (such as Vercel), API hosting, database and file storage (such as Supabase).</li>
                    </ul>
                    <p className='my-3 mx-0'>Each service has its own privacy policy, over which we have no control. You can revoke AlbumGuessnr's access in your Google, Spotify or Last.fm account settings. We may also disclose data when required by law.</p>

                    <h2 className="text-xl mt-9 border-b border-b-primary pb-1">
                        International transfers
                    </h2>
                    <p className='my-3 mx-0'>Our servers and those of our providers may be located outside Brazil (for example, in the United States), and Google processes data globally. By using the service, your data may be transferred to those locations.</p>

                    <h2 className="text-xl mt-9 border-b border-b-primary pb-1">
                        Retention
                    </h2>
                    <p className='my-3 mx-0'>We keep account and gameplay data while your account (or guest profile) exists and as needed for the service and the research. Google Analytics data follows the retention period configured in our property. You can request deletion of your data at any time (item 7). Research results that are already anonymized and aggregated may be kept.</p>

                    <h2 className="text-xl mt-9 border-b border-b-primary pb-1">
                        Your rights
                    </h2>
                    <p className='my-3 mx-0'>Under Brazil's LGPD, you may request confirmation of processing, access, correction, anonymization or deletion, portability, information about sharing, and withdrawal of consent. Write to albumguessnr@gmail.com. You can also withdraw your analytics consent through the site's cookie settings.</p>

                    <h2 className="text-xl mt-9 border-b border-b-primary pb-1">
                        Security, external links and changes
                    </h2>
                    <p className='my-3 mx-0'>We protect data by commercially acceptable means against loss, theft, and unauthorized access, disclosure, copying, use or modification. The site may link to external sites we do not operate, and we are not responsible for their policies. You are free to refuse to provide personal data, understanding that some services may become unavailable. We may update this policy; the date of the last update is shown at the top. By creating an account or continuing to use the service, you acknowledge this policy; usage analytics are only enabled with your explicit consent.</p>

                    <h2 className="text-xl mt-9 border-b border-b-primary pb-1">
                        Cookie Policy
                    </h2>
                    <p className='my-3 mx-0'>This is the Cookie Policy for AlbumGuessnr, accessible at <a href='albumguessnr.com'>albumguessnr.com</a>. Cookies are small files that the site stores in your browser so it can work and so we can understand how it is used.</p>
                    <table className='border-collapse'>
                        <thead>
                            <tr>
                                <th>
                                    Cookie
                                </th>
                                <th>
                                    Set by
                                </th>
                                <th>
                                    Purpose
                                </th>
                                <th>
                                    Duration
                                </th>
                                <th>
                                    Category
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    token
                                </td>
                                <td>
                                    api.albumguessnr.com
                                </td>
                                <td>
                                    Keeps you authenticated (account or guest). Not accessible by JavaScript.
                                </td>
                                <td>
                                    about 1 hour
                                </td>
                                <td>
                                    Necessary
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    refresh
                                </td>
                                <td>
                                    api.albumguessnr.com
                                </td>
                                <td>
                                    Renews your session automatically, without logging in again. Not accessible by JavaScript.
                                </td>
                                <td>
                                    7 days (accounts) or 30 days (guests), renewed on each visit
                                </td>
                                <td>
                                    Necessary
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    cc_cookie
                                </td>
                                <td>
                                    albumguessnr.com
                                </td>
                                <td>
                                    Stores your cookie choices.
                                </td>
                                <td>
                                    limited period
                                </td>
                                <td>
                                    Necessary
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    _ga e {'_ga<ID>'}
                                </td>
                                <td>
                                    albumguessnr.com (Google Analytics)
                                </td>
                                <td>
                                    Distinguishes visitors and sessions for usage statistics, for academic purposes.
                                </td>
                                <td>
                                    up to 2 years
                                </td>
                                <td>
                                    Analytics (consent only)
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p className='my-3 mx-0'><b>Third-party sign-in</b>. When you sign in with Google, Spotify or Last.fm, you are redirected to the provider's website, which may set cookies on its own domains, governed by its own policies. We have no access to or control over those cookies.</p>
                    <p className='my-3 mx-0'><b>Managing your cookies</b>. You can change or withdraw your choice about analytics cookies at any time in the site's cookie settings. When you withdraw, we delete the Google Analytics cookies and reload the page. You can also block cookies in your browser, but this may prevent login and other features from working.</p>

                    <h2 className="text-xl mt-9 border-b border-b-primary pb-1">
                        User's Responsibilities
                    </h2>
                    <p className='my-3 mx-0'>The user undertakes to use the site appropriately, including, without limitation:</p>
                    <ul className="my-3 mx-0 ml-7 list-disc">
                        <li className='my-3 mx-0'>Not to engage in activities that are illegal or contrary to good faith and public order;</li>
                        <li className='my-3 mx-0'>Not to spread racist, xenophobic or gambling content, illegal pornography, terrorist claims, or content against human rights;</li>
                        <li className='my-3 mx-0'>Not to cause damage to the systems of AlbumGuessnr, its suppliers or third parties, nor to spread viruses or other harmful code.</li>
                    </ul>
                </section>
            )}
        </div>
    );
};
