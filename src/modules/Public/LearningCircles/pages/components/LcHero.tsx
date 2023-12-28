import { Link, useNavigate } from "react-router-dom";
import styles from "../LandingPage.module.css";

type Props = {};

const LcHero = (_props: Props) => {
	const navigate = useNavigate();
    return (
        <>
            <nav className={styles.LClandingPageNav}>
                <img src="https://i.ibb.co/vY786NX/image.png" alt="muLearn" />
                <div className={styles.navLinks}>
                    <div>
                        <Link to="https://mulearn.org/">About</Link>
                        <Link to="https://mulearn.org/events/">Programs</Link>
                        <Link to="https://learn.mulearn.org/">
                            Interest Group
                        </Link>
                        <Link to="https://mulearn.org/careers">Careers</Link>
                    </div>
                    <button
                        onClick={() => {
                            navigate("/dashboard/connect-discord");
                        }}
                    >
                        Join Us
                    </button>
                </div>
            </nav>

            <div className={styles.LClandingPageHero}>
                <div className={styles.dash}></div>
                <div className={styles.heroTitle}>
                    <span>
                        <b>Introducing</b>{" "}
                        <img src="https://i.ibb.co/FDQ2M4n/Learn.png" alt="" />
                    </span>
                    <b>Learning Circles</b>
                </div>
                <p>
                    An informal mechanism for bringing together learners who are
                    interested in the same topic from across different fields
                    and disciplines. A fantastic way to spend a small amount of
                    time learning about new things with a group of people with
                    same interests!
                </p>
                <button onClick={() => navigate("/dashboard/learning-circle")}>
                    Create/Join Learning Circles
                </button>
            </div>
        </>
    );
};

export default LcHero;
