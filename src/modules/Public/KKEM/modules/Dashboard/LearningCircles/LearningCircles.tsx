import React, { useEffect, useState } from 'react'
import styles from './LearningCircles.module.css'
import { getLCDashboard, getLCReport, getOrgWiseReport } from './services/LearningCircles';
import { OrgCircle, OrgData, ResponseType, UserDetail } from './services/types';
import TableTop from '@/MuLearnComponents/TableTop/TableTop';
import Table from "@/MuLearnComponents/Table/Table";
import THead from '@/MuLearnComponents/Table/THead';
import Pagination from '@/MuLearnComponents/Pagination/Pagination';
import Chart from 'react-google-charts';
import { useSearchParams } from 'react-router-dom';
import { KKEMRoutes } from '@/MuLearnServices/urls';
const LearningCircles = () => {
    const [authorized, setAuthorized] = useState(true);
    const [searchParams] = useSearchParams();
    const key = searchParams.get("key"); // [key: string

    useEffect(() => {
        if (key === "CDV9co7KhOxA9pqbsi68Q07tsDlg9llapsMvmTSdFHs81SH1ol") {
            setAuthorized(true);
        }
        else {
            setAuthorized(false);
        }
    }, [key]);

    const [LcCounts, setLcCounts] = useState<ResponseType>({ lc_count: 0, total_enrollment: 0, circle_count_by_ig: [], unique_users: 0 })
    const [LcReport, setLcReport] = useState<UserDetail[]>([])
    const [OrgWiseReport, setOrgWiseReport] = useState<OrgData[]>([])

    const [sort, setSort] = useState("");
    const [sortOrg, setSortOrg] = useState("");

    const [date, setDate] = useState("");

    useEffect(() => {
        if (authorized) {
            getLCDashboard(setLcCounts);
            getLCReport(setLcReport, currentPage, perPage, setTotalPages, "", sort,"", setLoading);
            getOrgWiseReport(setOrgWiseReport, orgCurrentPage, orgPerPage, setOrgTotalPages, "", sortOrg,"", setOrgLoading);
        }
    }, [authorized])

    console.log(OrgWiseReport)
    console.log(LcReport)


    const columnOrder: ColOrder[] = [
        { column: "first_name", Label: "First Name", isSortable: true },
        { column: "last_name", Label: "Last Name", isSortable: true },
        { column: "muid", Label: "muid", isSortable: true },
        { column: "circle_name", Label: "Circle Name", isSortable: true },
        { column: "circle_ig", Label: "Circle IG", isSortable: true },
        { column: "organisation", Label: "organisation", isSortable: true },
        { column: "dwms_id", Label: "DWMS ID", isSortable: true },
        { column: "karma_earned", Label: "Karma Earned", isSortable: true },
    ];

    const orgColumnOrder: ColOrder[] = [
        { column: "org_title", Label: "Organisation", isSortable: true },
        { column: "learning_circle_count", Label: "Circle Count", isSortable: true },
        { column: "user_count", Label: "User Count", isSortable: true },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const [orgCurrentPage, setOrgCurrentPage] = useState(1);

    const [totalPages, setTotalPages] = useState(0);
    const [orgTotalPages, setOrgTotalPages] = useState(0);

    const [loading, setLoading] = useState(false);
    const [orgLoading, setOrgLoading] = useState(false);

    const [perPage, setPerPage] = useState(20);
    const [orgPerPage, setOrgPerPage] = useState(20);



    const handleNextClick = () => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        getLCReport(setLcReport, nextPage, perPage, setTotalPages);
    };

    const handleOrgNextClick = () => {
        const nextPage = orgCurrentPage + 1;
        setOrgCurrentPage(nextPage);
        getOrgWiseReport(setOrgWiseReport, nextPage, orgPerPage, setOrgTotalPages);
    }

    const handlePreviousClick = () => {
        const prevPage = currentPage - 1;
        setCurrentPage(prevPage);
        getLCReport(setLcReport, 1, perPage, setTotalPages);
    };

    const handleOrgPreviousClick = () => {
        const prevPage = orgCurrentPage - 1;
        setOrgCurrentPage(prevPage);
        getOrgWiseReport(setOrgWiseReport, 1, orgPerPage, setOrgTotalPages);
    }

    const handleSearch = (search: string) => {
        setCurrentPage(1);
        getLCReport(setLcReport, 1, perPage, setTotalPages, search, "");
    };

    const handleOrgSearch = (search: string) => {
        setOrgCurrentPage(1);
        getOrgWiseReport(setOrgWiseReport, 1, orgPerPage, setOrgTotalPages, search, "");
    }

    const handlePerPageNumber = (selectedValue: number) => {
        setCurrentPage(1);
        setPerPage(selectedValue);
        getLCReport(
            setLcReport,
            1,
            selectedValue,
            setTotalPages,
            "",
            ""
        );
    };

    const handleOrgPerPageNumber = (selectedValue: number) => {
        setOrgCurrentPage(1);
        setOrgPerPage(selectedValue);
        getOrgWiseReport(
            setOrgWiseReport,
            1,
            selectedValue,
            setOrgTotalPages,
            "",
            ""
        );
    }

    const handleIconClick = (column: string) => {
        if (sort === column) {
            setSort(`-${column}`);
            getLCReport(
                setLcReport,
                currentPage,
                perPage,
                setTotalPages,
                "",
                `-${column}`,
                "",
                setLoading

            );
        } else {
            setSort(column);
            getLCReport(
                setLcReport,
                currentPage,
                perPage,
                setTotalPages,
                "",
                column,
                "",
                setLoading
            );
        }
    };

    const handleOrgIconClick = (column: string) => {
        if (sortOrg === column) {
            setSortOrg(`-${column}`);
            getOrgWiseReport(
                setOrgWiseReport,
                orgCurrentPage,
                orgPerPage,
                setOrgTotalPages,
                "",
                `-${column}`,
                "",
                setOrgLoading
            );
        } else {
            setSortOrg(column);
            getOrgWiseReport(
                setOrgWiseReport,
                orgCurrentPage,
                orgPerPage,
                setOrgTotalPages,
                "",
                column,
                "",
                setOrgLoading
            );
        }
    };

    const data = [["Interest Group", "Total Circles"]];
    LcCounts.circle_count_by_ig
        .sort((a, b) => a.total_circles - b.total_circles) // sort by total_circles in ascending order
        .forEach((item) => {
            data.push([item.name, item.total_circles.toString()]);
        });


    useEffect(() => {
        // Create a mapping of organisations to unique learning circles
        const orgCircleMap: { [key: string]: Set<string> } = {};
        LcReport.forEach(item => {
            const { organisation, circle_name } = item;

            if (!orgCircleMap[organisation]) {
                orgCircleMap[organisation] = new Set();
            }

            orgCircleMap[organisation].add(circle_name);
        });

        // Convert the mapping to an array of { orgName, circleCount }
        const resultArray: OrgCircle[] = Object.entries(orgCircleMap).map(([org, circles]) => ({
            orgName: org,
            circleCount: circles.size
        }));

        // setOrgCirclesArray(resultArray);

        resultArray.sort((a, b) => {
            return a.circleCount - b.circleCount;
        });
    }, [LcReport]);


    return (
        <>
            {authorized ? <div className={styles.dashboardContainer}>
                <div className={styles.dashboardContent}>
                    <div className={styles.dateContainer}>
                        <p className={styles.heading}>Filter By Date</p>
                        <p className={styles.tagline}>If a date is selected, only the values that were recorded after that date will be displayed.</p>
                        <div>
                            <input type="date" className={styles.date} onChange={(e) => setDate(e.target.value)} />
                            <button className={styles.dateButton} onClick={() => {
                                getLCReport(setLcReport, currentPage, perPage, setTotalPages, "", "", date, setLoading);
                                getLCDashboard(setLcCounts, date);
                            }}>Filter</button>
                            <button className={styles.dateButton} onClick={() => {
                                getLCReport(setLcReport, currentPage, perPage, setTotalPages, "", "","", setLoading);
                                getLCDashboard(setLcCounts);
                            }
                            }>Clear</button>
                        </div>
                    </div>
                    <p className={styles.heading}>Learning Circles & Interest Group Counts</p>
                    <div className={styles.countsContainer}>
                        <div className={styles.studentsInvoled}>
                            <p className={styles.label}>Total Enrollment</p>
                            {LcCounts.total_enrollment && <p className={styles.count}>{LcCounts.total_enrollment}</p>}
                        </div>
                        <div className={styles.studentsInvoled}>
                            <p className={styles.label}>Unique Users</p>
                            {LcCounts.total_enrollment && <p className={styles.count}>{LcCounts.unique_users}</p>}
                        </div>
                        <div className={styles.lcCount}>
                            <p className={styles.label}>Learning Circles</p>
                            {LcCounts.lc_count && <p className={styles.count}>{LcCounts.lc_count}</p>}
                        </div>

                        {

                            LcCounts.circle_count_by_ig
                                .sort((a, b) => ((b.total_users ?? 0) as number) - ((a.total_users ?? 0) as number)) // sort by total_users in descending order
                                .map((item, index) => {
                                    return (
                                        <div className={styles.studentsInvoled} key={index}>
                                            <p className={styles.label}>{item.name}</p>
                                            <div className={styles.counts}>
                                                <div>
                                                    <p className={styles.count}>{item.total_circles}</p>
                                                    <span>Circles</span>
                                                </div>
                                                <div>
                                                    <p className={styles.count}>{item.total_users}</p>
                                                    <span>Users</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                        }


                    </div>
                    <br />

                    <div className={styles.chartContainer}>
                        <Chart
                            width={"100%"}
                            height={"400px"}
                            chartType="Bar"
                            loader={<div>Loading Chart</div>}
                            data={data}
                            options={{
                                chart: {
                                    title: "Interest Group Counts",
                                },
                            }}
                        />

                    </div>


                    <p className={styles.heading}>User Wise Counts</p>
                    <div className={styles.tableContainer}>

                        <TableTop
                            onSearchText={handleSearch}
                            onPerPageNumber={handlePerPageNumber}
                            CSV={KKEMRoutes.getLcReport}
                        />
                        <br />
                        <Table
                            rows={LcReport}
                            page={currentPage}
                            perPage={perPage}
                            columnOrder={columnOrder}
                            isloading={loading}
                        >
                            <THead
                                columnOrder={columnOrder}
                                // editableColumnNames={editableColumnNames}
                                onIconClick={handleIconClick}
                            />
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                margin="10px 0"
                                handleNextClick={handleNextClick}
                                handlePreviousClick={handlePreviousClick}
                                onPerPageNumber={handlePerPageNumber}
                                perPage={perPage}
                                setPerPage={setPerPage}
                            />
                            {/*use <Blank/> when u don't need <THead /> or <Pagination inside <Table/> cause <Table /> needs atleast 2 children*/}
                        </Table>

                    </div>
                    <br />
                    <p className={styles.heading}>Organization Wise Counts</p>
                    <div className={styles.tableContainer}>

                        <TableTop
                            onSearchText={handleOrgSearch}
                            onPerPageNumber={handleOrgPerPageNumber}
                        />
                        <br />
                        <Table
                            rows={OrgWiseReport}
                            page={orgCurrentPage}
                            perPage={orgPerPage}
                            columnOrder={orgColumnOrder}
                            isloading={orgLoading}
                        >
                            <THead
                                columnOrder={orgColumnOrder}
                                // editableColumnNames={editableColumnNames}
                                onIconClick={handleOrgIconClick}
                            />
                            <Pagination
                                currentPage={orgCurrentPage}
                                totalPages={orgTotalPages}
                                margin="10px 0"
                                handleNextClick={handleOrgNextClick}
                                handlePreviousClick={handleOrgPreviousClick}
                                onPerPageNumber={handleOrgPerPageNumber}
                                perPage={orgPerPage}
                                setPerPage={setOrgPerPage}
                            />
                            {/*use <Blank/> when u don't need <THead /> or <Pagination inside <Table/> cause <Table /> needs atleast 2 children*/}
                        </Table>

                    </div>
                </div>
            </div> : (key ? <div className={styles.dashboardContainer}> <p className={styles.heading}>You are not authorized to view this page</p></div> : <div className={styles.dashboardContainer}> <p className={styles.heading}>Please enter the key to view this page</p></div>)}

        </>
    )
}

export default LearningCircles
