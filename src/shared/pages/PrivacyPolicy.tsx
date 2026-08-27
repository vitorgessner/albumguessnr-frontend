import { useEffect, useState } from 'react';

export const PrivacyPolicy = () => {
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        document.title = 'Privacy policy';
    }, []);

    return (
        <div className="max-w-195 m-auto pt-10 pb-20 px-6 leading-[1.65] text-[#1f2328]">
            <h1 className="text-3xl mb-0.5">Política de Privacidade / Privacy Policy</h1>
            <p className="text-[#57606a] text-base mb-8">AlbumGuessnr</p>

            <div className="sticky top-0 bg-cream py-3 px-0 mb-6 border-b border-b-primary z-10">
                <button
                    id="btn-pt"
                    className={`text-sm py-1.5 px-4 mr-2 border border-primary rounded-md cursor-pointer ${language === 'pt-BR' ? 'sage-component' : 'primary-component'}`}
                    onClick={() => setLanguage('pt-BR')}
                >
                    Português
                </button>
                <button
                    id="btn-en"
                    onClick={() => setLanguage('en')}
                    className={`text-sm py-1.5 px-4 mr-2 border border-primary rounded-md cursor-pointer ${language === 'en' ? 'sage-component' : 'primary-component'}`}
                >
                    English
                </button>
            </div>

            {language === 'pt-BR' && (
                <section id="lang-pt">
                    <h2 className="text-xl mt-9 border-b border-b-primary pb-1">
                        Política de Privacidade
                    </h2>
                    <p className="my-3 mx-0">
                        Sua privacidade é importante para nós. É política do AlbumGuessnr respeitar
                        sua privacidade em relação a qualquer informação que possamos coletar de
                        você em nosso site, AlbumGuessnr, e outros sites que possuímos e operamos.
                    </p>
                    <p className="my-3 mx-0">
                        Solicitamos informações pessoais apenas quando realmente necessário para
                        fornecer um serviço a você. Coletamos essas informações por meios justos e
                        legais, com seu conhecimento e consentimento. Também informamos por que
                        estamos coletando essas informações e como elas serão usadas.
                    </p>
                    <p className="my-3 mx-0">
                        Retemos as informações coletadas apenas pelo tempo necessário para fornecer
                        o serviço solicitado. Os dados que armazenamos são protegidos por meios
                        comercialmente aceitáveis para evitar perda, roubo, acesso não autorizado,
                        divulgação, cópia, uso ou modificação.
                    </p>
                    <p className="my-3 mx-0">
                        Não compartilhamos nenhuma informação de identificação pessoal publicamente
                        ou com terceiros, exceto quando exigido por lei.
                    </p>
                    <p className="my-3 mx-0">
                        Nosso site pode conter links para sites externos que não são operados por
                        nós. Esteja ciente de que não temos controle sobre o conteúdo e as práticas
                        desses sites, e não podemos aceitar responsabilidade por suas respectivas
                        políticas de privacidade.
                    </p>
                    <p className="my-3 mx-0">
                        Você é livre para recusar nossa solicitação de suas informações pessoais,
                        entendendo que talvez não possamos fornecer alguns dos serviços desejados.
                    </p>
                    <p className="my-3 mx-0">
                        O uso continuado do nosso site será considerado como aceitação de nossas
                        práticas em relação à privacidade e informações pessoais. Se você tiver
                        alguma dúvida sobre como tratamos os dados dos usuários e informações
                        pessoais, entre em contato conosco.
                    </p>

                    <h2 className="text-xl mt-9 border-b border-b-primary pb-1">
                        Política de Cookies
                    </h2>
                    <p className="my-3 mx-0">
                        Esta é a Política de Cookies do AlbumGuessnr, acessível pela URL{' '}
                        <a href="https://albumguessnr.com">https://albumguessnr.com</a>.
                    </p>

                    <h3 className="text-lg mt-7 text-sage-dark">O que são cookies</h3>
                    <p className="my-3 mx-0">
                        Como é prática comum em quase todos os sites profissionais, este site usa
                        cookies, que são pequenos arquivos baixados no seu computador, para melhorar
                        sua experiência. Esta página descreve quais informações eles coletam, como
                        as usamos e por que às vezes precisamos armazená-los. Também explicamos como
                        você pode evitar que esses cookies sejam armazenados, embora isso possa
                        prejudicar ou quebrar certos elementos da funcionalidade do site.
                    </p>

                    <h3 className="text-lg mt-7 text-sage-dark">Como usamos os cookies</h3>
                    <p className="my-3 mx-0">
                        Usamos cookies por diversos motivos, detalhados abaixo. Na maioria dos
                        casos, não há opções padrão da indústria para desabilitar cookies sem
                        desabilitar completamente as funcionalidades e recursos que eles adicionam a
                        este site. Recomendamos que você mantenha os cookies ativados caso não tenha
                        certeza se precisa deles, para evitar interromper algum serviço que você
                        utiliza.
                    </p>

                    <h3 className="text-lg mt-7 text-sage-dark">Os cookies que definimos</h3>

                    <p className="my-3 mx-0">
                        <strong>Cookies de autenticação</strong>
                        <br />
                        Quando você faz login em nosso site — seja por e-mail e senha, seja
                        utilizando uma conta de terceiros como o Google — definimos cookies (
                        <code>token</code> e <code>refresh</code>) para mantê-lo autenticado
                        enquanto utiliza o site. Esses cookies são armazenados em nosso domínio e
                        não são acessíveis por scripts do lado do cliente (JavaScript), como medida
                        de segurança. Eles expiram automaticamente após um período limitado e são
                        necessários para a funcionalidade principal do site (permanecer conectado).
                    </p>

                    <p className="my-3 mx-0">
                        <strong>Login por terceiros (OAuth)</strong>
                        <br />
                        Se você optar por entrar usando Google, Spotify ou Last.fm, será
                        redirecionado ao site do respectivo provedor para autorizar o acesso.
                        Durante esse processo, cookies podem ser definidos pelo provedor (Google,
                        Spotify ou Last.fm) em seus próprios domínios, regidos pelas respectivas
                        políticas de privacidade deles, não pela nossa. Não temos acesso nem
                        controle sobre esses cookies. Recebemos apenas as informações necessárias
                        para autenticá-lo (como e-mail, nome de usuário e informações de perfil)
                        após você autorizar a conexão.
                    </p>

                    <p className="my-3 mx-0">
                        <strong>Cookies analíticos</strong>
                        <br />
                        Utilizamos o Google Analytics (GA4) para entender como os visitantes
                        interagem com nosso site — por exemplo, quantos usuários são novos ou
                        recorrentes, quanto tempo passam em diferentes telas e quais funcionalidades
                        utilizam. Essas informações são coletadas de forma agregada e anonimizada, e
                        os cookies são definidos em nosso próprio domínio pelo script do Google
                        Analytics. Essa coleta tem finalidade acadêmica, como parte da pesquisa
                        deste projeto de graduação. Esses cookies só são ativados mediante seu
                        consentimento explícito, e você pode revogar essa escolha a qualquer momento
                        através das configurações de cookies do site.
                    </p>

                    <h3 className="text-lg mt-7 text-sage-dark">Desativando cookies</h3>
                    <p className="my-3 mx-0">
                        Você pode impedir a definição de cookies ajustando as configurações do seu
                        navegador (consulte a seção de Ajuda do seu navegador para saber como fazer
                        isso). Esteja ciente de que desativar cookies afetará a funcionalidade deste
                        e de muitos outros sites que você visita, incluindo a capacidade de
                        permanecer conectado.
                    </p>

                    <h3 className="text-lg mt-7 text-sage-dark">Responsabilidades do usuário</h3>
                    <p className="my-3 mx-0">
                        O usuário se compromete a fazer uso apropriado dos conteúdos e informações
                        oferecidos no site, com comportamento enunciativo, mas não limitado a:
                    </p>
                    <ul className="pl-5">
                        <li>
                            Não se envolver em atividades ilegais ou contrárias à boa-fé e à ordem
                            pública;
                        </li>
                        <li>
                            Não difundir propaganda ou conteúdo de natureza racista, xenofóbica,
                            relacionado a jogos de azar, qualquer tipo de pornografia ilegal,
                            apologia ao terrorismo ou contra os direitos humanos;
                        </li>
                        <li>
                            Não causar danos aos sistemas físicos (hardware) e lógicos (software) do
                            AlbumGuessnr, de seus fornecedores ou de terceiros, nem introduzir ou
                            disseminar vírus de computador ou quaisquer outros sistemas capazes de
                            causar os danos mencionados anteriormente.
                        </li>
                    </ul>

                    <h3 className="text-lg mt-7 text-sage-dark">Mais informações</h3>
                    <p className="my-3 mx-0">
                        Esperamos que isso tenha esclarecido as coisas para você. Se houver algo
                        sobre o qual você não tenha certeza se precisa ou não, geralmente é mais
                        seguro manter os cookies ativados, caso interajam com algum recurso que você
                        usa em nosso site.
                    </p>

                    <p className="mt-10 text-sm text-[#57606a] italic border-t-sage border-t pt-4">
                        Esta política é válida a partir de 26 de agosto de 2026.
                    </p>
                </section>
            )}

            {language === 'en' && (
                <section id="lang-en" className="lang">
                    <h2 className="text-xl mt-9 border-b border-b-primary pb-1">Privacy Policy</h2>
                    <p className="my-3 mx-0">
                        Your privacy is important to us. It is AlbumGuessnr's policy to respect your
                        privacy regarding any information we may collect from you across our
                        website, AlbumGuessnr, and other sites we own and operate.
                    </p>
                    <p className="my-3 mx-0">
                        We only ask for personal information when we truly need it to provide a
                        service to you. We collect it by fair and lawful means, with your knowledge
                        and consent. We also let you know why we're collecting it and how it will be
                        used.
                    </p>
                    <p className="my-3 mx-0">
                        We only retain collected information for as long as necessary to provide you
                        with your requested service. What data we store, we'll protect within
                        commercially acceptable means to prevent loss and theft, as well as
                        unauthorised access, disclosure, copying, use or modification.
                    </p>
                    <p className="my-3 mx-0">
                        We don't share any personally identifying information publicly or with third
                        parties, except when required to by law.
                    </p>
                    <p className="my-3 mx-0">
                        Our website may link to external sites that are not operated by us. Please
                        be aware that we have no control over the content and practices of these
                        sites, and cannot accept responsibility or liability for their respective
                        privacy policies.
                    </p>
                    <p className="my-3 mx-0">
                        You are free to refuse our request for your personal information, with the
                        understanding that we may be unable to provide you with some of your desired
                        services.
                    </p>
                    <p className="my-3 mx-0">
                        Your continued use of our website will be regarded as acceptance of our
                        practices around privacy and personal information. If you have any questions
                        about how we handle user data and personal information, feel free to contact
                        us.
                    </p>

                    <h2 className="text-xl mt-9 border-b border-b-primary pb-1">Cookie Policy</h2>
                    <p className="my-3 mx-0">
                        This is the Cookie Policy for AlbumGuessnr, accessible from{' '}
                        <a href="https://albumguessnr.com">https://albumguessnr.com</a>.
                    </p>

                    <h3 className="text-lg mt-7 text-sage-dark">What Are Cookies</h3>
                    <p className="my-3 mx-0">
                        As is common practice with almost all professional websites, this site uses
                        cookies, which are tiny files downloaded to your computer, to improve your
                        experience. This page describes what information they gather, how we use it,
                        and why we sometimes need to store these cookies. We also explain how you
                        can prevent these cookies from being stored, although this may downgrade or
                        break certain elements of the site's functionality.
                    </p>

                    <h3 className="text-lg mt-7 text-sage-dark">How We Use Cookies</h3>
                    <p className="my-3 mx-0">
                        We use cookies for a variety of reasons, detailed below. In most cases,
                        there are no industry-standard options for disabling cookies without
                        completely disabling the functionality and features they add to this site.
                        It is recommended that you leave cookies enabled if you are unsure whether
                        you need them, in case they support a service you use.
                    </p>

                    <h3 className="text-lg mt-7 text-sage-dark">The Cookies We Set</h3>

                    <p className="my-3 mx-0">
                        <strong>Authentication cookies</strong>
                        <br />
                        When you log in to our website — whether by email and password, or by
                        signing in with a third-party account such as Google — we set cookies (
                        <code>token</code> and <code>refresh</code>) to keep you authenticated while
                        you use the site. These cookies are stored on our domain and are not
                        accessible by client-side scripts, as a security measure. They expire
                        automatically after a limited period and are required for the site's core
                        functionality (staying logged in).
                    </p>

                    <p className="my-3 mx-0">
                        <strong>Third-party sign-in (OAuth)</strong>
                        <br />
                        If you choose to sign in using Google, Spotify, or Last.fm, you will be
                        redirected to that provider's own website to authorize access. During this
                        process, cookies may be set by the provider (Google, Spotify, or Last.fm) on
                        their own domains, governed by their respective privacy policies, not ours.
                        We do not have access to, and do not control, these cookies. We only receive
                        the information necessary to authenticate you (such as your email, username,
                        and profile information) once you authorize the connection.
                    </p>

                    <p className="my-3 mx-0">
                        <strong>Analytics cookies</strong>
                        <br />
                        We use Google Analytics (GA4) to understand how visitors interact with our
                        website — such as how many users are new versus returning, how long they
                        spend on different screens, and which features are used. This information is
                        collected in an aggregated and anonymized form, and the cookies are set on
                        our own domain by the Google Analytics script. This collection serves an
                        academic purpose, as part of this graduation project's research. These
                        cookies are only enabled with your explicit consent, and you can revoke that
                        choice at any time through the site's cookie settings.
                    </p>

                    <h3 className="text-lg mt-7 text-sage-dark">Disabling Cookies</h3>
                    <p className="my-3 mx-0">
                        You can prevent the setting of cookies by adjusting your browser settings
                        (see your browser's Help section for how to do this). Be aware that
                        disabling cookies will affect the functionality of this and many other
                        websites you visit, including the ability to stay logged in.
                    </p>

                    <h3 className="text-lg mt-7 text-sage-dark">User's Responsibilities</h3>
                    <p className="my-3 mx-0">
                        The user undertakes the responsibility to make appropriate use of the
                        content and information offered on the site, including, but not limited to:
                    </p>
                    <ul className="pl-5">
                        <li>
                            Not to engage in activities that are illegal or contrary to good faith
                            and public order;
                        </li>
                        <li>
                            Not to spread propaganda or content of a racist, xenophobic, or gambling
                            nature, any type of illegal pornography, terrorist claims, or content
                            against human rights;
                        </li>
                        <li>
                            Not to cause damage to the physical (hardware) or logical (software)
                            systems of AlbumGuessnr, its suppliers, or third parties, nor to
                            introduce or disseminate computer viruses or any other systems capable
                            of causing the aforementioned damage.
                        </li>
                    </ul>

                    <h3 className="text-lg mt-7 text-sage-dark">More Information</h3>
                    <p className="my-3 mx-0">
                        Hopefully, this has clarified things for you. If there is something you
                        aren't sure whether you need or not, it is usually safer to leave cookies
                        enabled in case they interact with a feature you use on our site.
                    </p>

                    <p className="mt-10 text-sm text-[#57606a] italic border-t-sage border-t pt-4">
                        This policy is effective as of August 26, 2026.
                    </p>
                </section>
            )}
        </div>
    );
};
