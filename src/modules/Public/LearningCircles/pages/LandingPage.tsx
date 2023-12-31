import { useEffect, useState } from "react";
import styles from "./LandingPage.module.css";
import {
    fetchCampusOptions,
    fetchCountryOptions,
    fetchDistrictOptions,
    fetchLC,
    fetchStateOptions,
    getCount,
    getInterestGroups
} from "../services/LandingPageApi";
import Select from "react-select";
import MuLoader from "@/MuLearnComponents/MuLoader/MuLoader";
import LcHero from "./components/LcHero";
import LcStats from "./components/LcStats";
import LcCards from "./components/LcCards";
import { customStyles } from "../utils";

interface Option {
    value: string;
    label: string;
}
const LandingPage = () => {
    const [data, setData] = useState<any>([]);
    const [CountryOptions, setCountryOptions] = useState<Option[]>([]);
    const [country, setCountry] = useState(
        "3ceeb230-06a2-48de-8c5b-e6c64cf9059f"
    );
    const [stateOptions, setStateOptions] = useState<Option[]>([]);
    const [state, setState] = useState("44c63af8-8747-43d1-8402-ba79215d4bed");
    const [districtOptions, setDistrictOptions] = useState<Option[]>([]);
    const [district, setDistrict] = useState("");
    const [campusOptions, setCampusOptions] = useState<Option[]>([]);
    const [campus, setCampus] = useState("");
    const [igOptions, setIgOptions] = useState<Option[] | undefined>([]);
    const [ig, setIg] = useState("");
    const [count, setCount] = useState<LcCount>();

    const [selectedDistrict, setSelectedDistrict] = useState<Option | null>(
        null
    );
    const [selectedCampus, setSelectedCampus] = useState<Option | null>(null);
    const [selectedIg, setSelectedIg] = useState<Option | null>(null);
    const [msg, setMsg] = useState<string>("Select a district");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchCountryOptions(setCountryOptions);
        fetchStateOptions(country, setStateOptions);
        fetchDistrictOptions(state, setDistrictOptions);
        fetchLC(setLoading, setData);
        getCount(setCount);
    }, []);

    const handleCountryChange = async (selectedCountry: Option | null) => {
        if (selectedCountry) {
            setCountry(selectedCountry.value);
            fetchStateOptions(selectedCountry.value, setStateOptions);
            // Reset other options
            setDistrictOptions([]);
            setCampusOptions([]);
            setIgOptions(undefined);
            setData([]);
        }
    };

    const handleStateChange = (state: Option | null) => {
        if (state) {
            setState(state.value);
            fetchDistrictOptions(state.value, setDistrictOptions);
            // Reset other options
            setCampusOptions([]);
            setIgOptions(undefined);
            setData([]);
        }
    };

    const handleDistrictChange = async (selectedDistrict: Option | null) => {
        if (selectedDistrict) {
            setDistrict(selectedDistrict.value);
            setSelectedDistrict(selectedDistrict);
            fetchCampusOptions(selectedDistrict.value, setCampusOptions);
            // Reset other options
            fetchLC(setLoading, setData, selectedDistrict.value);
            setIgOptions(undefined);
            setData([]);
            setSelectedCampus(null);
            setSelectedIg(null);
            setMsg("Select a campus");
        }
    };

    const handleCampusChange = async (selectedCampus: Option | null) => {
        if (selectedCampus) {
            setSelectedCampus(selectedCampus);
            setCampus(selectedCampus.value);
            setIgOptions(await getInterestGroups());
            setSelectedIg(null);
            fetchLC(setLoading, setData, district, selectedCampus.value);
            setData([]);
            setMsg("");
        }
    };

    const handleIgChange = (selectedIg: Option | null) => {
        if (selectedIg) {
            setIg(selectedIg.value);
            setSelectedIg(selectedIg);
            fetchLC(setLoading, setData, district, campus, selectedIg.value);
        }
    };

    return (
        <div className={styles.LClandingPage}>
            <LcHero />
			<LcStats count={count} />
            

            <div className={styles.LClandingPageExplore}>
                <div className={styles.exploreTitle}>
                    <b>Explore</b> <span>Learning Circles</span>
                </div>
                <form className={styles.LClandingPageForm}>
                    <div className={styles.selectOptions}>
                        <Select
                            isSearchable
                            defaultValue={{
                                value: "f1840070-ec45-4b09-b582-763482137474",
                                label: "India"
                            }}
                            placeholder="Select Country"
                            options={CountryOptions}
                            isDisabled={true}
                            onChange={handleCountryChange}
                            styles={customStyles}
                        />
                        <Select
                            isSearchable
                            defaultValue={{
                                value: "44c63af8-8747-43d1-8402-ba79215d4bed",
                                label: "Kerala"
                            }}
                            placeholder="Select State"
                            options={stateOptions}
                            isDisabled={true}
                            onChange={handleStateChange}
                            styles={customStyles}
                        />
                        <Select
                            isSearchable
                            placeholder="Select District"
                            value={selectedDistrict}
                            options={districtOptions}
                            onChange={handleDistrictChange}
                            styles={customStyles}
                        />
                        <Select
                            isSearchable
                            placeholder="Select Campus"
                            value={selectedCampus}
                            options={campusOptions}
                            onChange={handleCampusChange}
                            styles={customStyles}
                        />
                        <Select
                            isSearchable
                            value={selectedIg}
                            placeholder="Select IG"
                            options={igOptions}
                            onChange={handleIgChange}
                            styles={customStyles}
                        />
                    </div>
                </form>

                {loading ? (
                    <div className={styles.loader}>
                        <MuLoader />
                    </div>
                ) : (
                    <LcCards data={data} msg={msg} />
                )}
            </div>
        </div>
    );
};

export default LandingPage;