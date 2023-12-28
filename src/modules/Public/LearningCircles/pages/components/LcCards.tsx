import { joinCircle } from "../../../../Dashboard/modules/LearningCircle/services/LearningCircleAPIs";
import styles from "../LandingPage.module.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import imageBottom from "../../Assets/LC3.webp";

type Props = {
	data: any[];
	msg: string;
};

const LcCards = (props: Props) => {
    const navigate = useNavigate();

    const handleJoinClick = (id: string) => {
        const acessToken = localStorage.getItem("accessToken");
        if (!acessToken) {
            toast.error("Please login to join a circle");
            navigate("/login");
        } else joinCircle(id);
    };

    return (
        <div className={styles.container}>
            {props.data.length > 0 ? (
                props.data.map((lc: LcRandom) => (
                    <div className={styles.exploreCards}>
                        <img
                            src="https://i.ibb.co/zJkPfqB/Iot-Vector.png"
                            alt="png"
                        />
                        <h1>{lc.name}</h1>
                        <span>
                            <b>{lc.ig_name}</b> &nbsp;{" "}
                            <b>Members count: {lc.member_count}</b>{" "}
                            {lc.meet_place && (
                                <>
                                    <br />
                                    <b>Meet Place: {lc.meet_place}</b>{" "}
                                </>
                            )}
                            {lc.meet_time && (
                                <>
                                    <br />
                                    <b>Meet Time: {lc.meet_time}</b>{" "}
                                </>
                            )}
                        </span>
                        <div
                            onClick={() => {
                                handleJoinClick(lc.id.toString());
                            }}
                            className={styles.joinCircle}
                        >
                            Join Circle
                        </div>{" "}
                    </div>
                ))
            ) : (
                <div className={styles.LClandingPagenone}>
                    <img
                        src={imageBottom}
                        alt="No Learning Circles available"
                        loading="eager"
                    />
                    <b>{props.msg}</b>
                </div>
            )}
        </div>
    );
};

export default LcCards;