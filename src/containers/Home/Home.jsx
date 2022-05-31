import homeLogo from '../../assets/images/logo1.png';

function Home() {
    const handleGetStarted = () => {
            location.href = "/login"
    }

    return (
            <div className="welcomeScreen">
            <div className="inner-center">
                <div className="logo-main">
                    <img src={homeLogo} />
                </div>
                <h1>
                    Analyze the hiring trends for 4,000+ companies <br />
                    and usage trends for 500+ SaaS products
                </h1>

                <button id="login" type="submit" onClick={()=>handleGetStarted()}>Get Started</button>
            </div>
        </div>
    );
}

export default Home;

