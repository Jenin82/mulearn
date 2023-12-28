import { useEffect, useRef, useState } from "react";
import styles from "../LandingPage.module.css";

type Props = {count?: LcCount};

const LcStats = (props: Props) => {
    const [counters, setCounters] = useState<number[]>([0, 0, 0, 0, 0]); // Initialize counters
    const durationInSeconds = 3; // Duration in seconds

    const targetRef = useRef<HTMLDivElement>(null); // Create a ref

    const isElementInViewport = (el: HTMLElement | null) => {
        if (!el) {
            return false;
        }
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <=
                (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <=
                (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    useEffect(() => {
        const finalValues: number[] = [
            props.count?.interest_group ?? 0,
            props.count?.college ?? 0,
            props.count?.learning_circle ?? 0,
            props.count?.total_no_of_users ?? 0
        ];

        const startCounterAnimation = () => {
            const interval = setInterval(() => {
                setCounters(prevCounters =>
                    prevCounters.map((counter, index) =>
                        counter < finalValues[index]
                            ? counter +
                            Math.ceil(
                                  finalValues[index] / (durationInSeconds * 20)
                              ) // Increment smoothly
                            : finalValues[index]
                    )
                );
            }, 50);

            return () => clearInterval(interval);
        };

        let cleanup: (() => void) | undefined;

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    cleanup = startCounterAnimation();
                }
            },
            {
                root: null,
                rootMargin: "0px",
                threshold: 0.5
            }
        );

        if (targetRef.current) {
            if (isElementInViewport(targetRef.current)) {
                cleanup = startCounterAnimation();
            } else {
                observer.observe(targetRef.current);
            }
        }

        return () => {
            if (cleanup) {
                cleanup();
            }
            if (targetRef.current) {
                observer.unobserve(targetRef.current);
            }
        };
    }, [props.count]);

    return (
        <div className={styles.LClandingPageEarth}>
            <div className={styles.totalCount}>
                <div ref={targetRef}>
                    {counters.map((counter, index) => (
                        <div className={styles.count} key={index}>
                            <b>
                                {index > 1
                                    ? counter >= 20
                                        ? `${counter}+`
                                        : counter
                                    : counter.toLocaleString()}
                            </b>
                            <p>
                                {index === 0
                                    ? "Interest Groups"
                                    : index === 1
                                    ? "Colleges"
                                    : index === 2
                                    ? "Learning Circles"
                                    : index === 3
                                    ? "Number of Users"
                                    : ""}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <img src="https://i.ibb.co/BwGShc8/planet.png" alt="globe" />
        </div>
    );
};

export default LcStats;