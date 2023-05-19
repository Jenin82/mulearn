import styles from "../components/SideNavBar.module.css";

import { Outlet } from "react-router-dom";
import SideNavBar from "../components/SideNavBar";
import TopNavBar from "../components/TopNavBar";
import { useEffect, useState } from "react";
import adminButtons from "../utils/userwiseButtonsData/adminButtons";
// import companyButtons from "../utils/userwiseButtonsData/companyButtons";
// import userButtons from "../utils/userwiseButtonsData/userButtons";
import { roles } from "../../../services/types";

const DashboardRootLayout = (props: { component?: any }) => {
    const [connected, setConnected] = useState(false);
    const [campusLead, setCampusLead] = useState(false);
    const [userType, setUserType] = useState("");

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
        const existInGuild = userInfo.existInGuild === "True";
        const isCampusAmbassador = userInfo.roles?.includes(
            roles.CAMPUS_AMBASSADOR
        );
        const isAdmin = userInfo.roles?.includes(roles.ADMIN);

        setConnected(existInGuild);
        setCampusLead(isCampusAmbassador);
        setUserType(isAdmin ? "admin" : "user");
    }, []);

    const buttons = [
        {
            url: "profile",
            title: "Profile",
            hasView: true,
            icon: <i className="fi fi-sr-clipboard-user"></i>
        },
        {
            url: "connect-discord",
            title: "Connect Discord",
            hasView: !connected,
            icon: <i className="fi fi-sr-data-transfer"></i>
        },
        {
            url: "campus-details",
            title: "Campus Details",
            hasView: true,
            roles: [roles.CAMPUS_AMBASSADOR],
            icon: <i className="fi fi-sr-book-arrow-right"></i>
        },
        {
            url: "interest-groups",
            title: "Interest Groups",
            hasView: true,
            roles: [roles.ADMIN],
            icon: <i className="fi fi-sr-layout-fluid"></i>
        },
        {
            url: "manage-users",
            title: "Manage Users",
            hasView: true,
            roles: [roles.ADMIN],
            icon: <i className="fi fi-sr-users"></i>
        }
    ];

    // //Swtich Case not recommended
    // switch (userType) {
    //     case "admin":
    //         buttons.push(...adminButtons);
    //         break;
    // }

    // if (!connected) {
    //     buttons.splice(1, 0, {
    //         url: "connect-discord",
    //         title: "Connect Discord",
    //         icon: <i className="fi fi-sr-data-transfer"></i>
    //     });
    // }
    // if (campusLead) {
    //     buttons.splice(2, 0, {
    //         url: "campus-details",
    //         title: "Campus Details",
    //         icon: <i className="fi fi-sr-book-arrow-right"></i>
    //     });
    // }

    return (
        <div className={styles.full_page}>
            <SideNavBar sidebarButtons={buttons} />
            <div className={styles.right_side}>
                <TopNavBar />
                <div className={styles.main_content}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardRootLayout;
