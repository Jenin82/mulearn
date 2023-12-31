import { useState, useEffect } from "react";
import {
    fetchCountryOptions,
    fetchStateOptions,
    fetchDistrictOptions,
    fetchCampusOptions
} from "../services/LandingPageApi";

export const useLocationOptions = (selected: SelectedOptions) => {
    const [countryOptions, setCountryOptions] = useState<Option[]>([]);
    const [stateOptions, setStateOptions] = useState<Option[]>([]);
    const [districtOptions, setDistrictOptions] = useState<Option[]>([]);
    const [campusOptions, setCampusOptions] = useState<Option[]>([]);

    useEffect(() => {
        fetchCountryOptions().then(setCountryOptions);
    }, []);

    useEffect(() => {
        if (selected.country) {
            fetchStateOptions(selected.country.value).then(setStateOptions);
        }
    }, [selected.country]);

    useEffect(() => {
        if (selected.state) {
            fetchDistrictOptions(selected.state.value).then(setDistrictOptions);
        }
    }, [selected.state]);

    useEffect(() => {
        if (selected.district) {
            fetchCampusOptions(selected.district.value).then(setCampusOptions);
        }
    }, [selected.district]);

    return { countryOptions, stateOptions, districtOptions, campusOptions };
};