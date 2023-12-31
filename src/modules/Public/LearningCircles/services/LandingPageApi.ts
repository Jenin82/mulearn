import { privateGateway } from "@/MuLearnServices/apiGateways";
import { dynamicRoute, getLocationRoutes } from "@/MuLearnServices/endpoints";
import { dashboardRoutes, onboardingRoutes } from "@/MuLearnServices/urls";
import { AxiosError } from "axios";
import { Dispatch } from "react";

export const fetchCountryOptions = async () => {
    try {
        const response = await privateGateway.get(
            dynamicRoute(getLocationRoutes.getCountries)
        );
        return response.data.response.countries
            .sort((a: BackendOption, b: BackendOption) =>
                a.name.localeCompare(b.name)
            )
            .map((country: BackendOption) => ({
                value: country.id,
                label: country.name
            }));
    } catch (err: unknown) {
        const error = err as AxiosError;
        if (error?.response) {
            throw error;
        }
    }
};

export const fetchStateOptions = async (country: string) => {
    try {
        const response = await privateGateway.get(
            dynamicRoute(getLocationRoutes.getStates),
			{
				params: {
					country: country
				}
			}
        )
        return response.data.response.states
            .sort((a: BackendOption, b: BackendOption) => a.name.localeCompare(b.name))
            .map((sate: BackendOption) => ({
                value: sate.id,
                label: sate.name
            }));
    } catch (err: unknown) {
        const error = err as AxiosError;
        if (error?.response) {
            throw error;
        }
    }
};

export const fetchLC = async (
    setLoading: UseStateFunc<boolean>,
    setData: UseStateFunc<any>,
    district?: string,
    campus?: string,
    ig?: string | null
) => {
    setLoading(true);
    try {
        const response = await privateGateway.post(
            dashboardRoutes.getCampusLearningCircles + "list" + "/",
            {
                ig_id: ig,
                org_id: campus,
                district_id: district
            }
        );
        setData(response.data.response);
    } catch (err: unknown) {
        const error = err as AxiosError;
        if (error?.response) {
            throw error;
        }
    } finally {
        setLoading(false);
    }
};

	

	

	export const fetchDistrictOptions = async (
		state: string,
		setDistrict: UseStateFunc<Option[]>
	) => {
		try {
			const response = (await privateGateway.post(
				onboardingRoutes.districtList,
				{
					state: state
				}
			)) as APIResponse<{ districts: { id: string; name: string }[] }>;
			setDistrict(
				response.data.response.districts
					.sort((a, b) => a.name.localeCompare(b.name))
					.map(sate => ({
						value: sate.id,
						label: sate.name
					}))
			);
		} catch (err: unknown) {
			const error = err as AxiosError;
			if (error?.response) {
				throw error;
			}
		}
	};

type getAPI = UseStateFunc<{ id: string; title: string }[]>;

export const fetchCampusOptions = async (
    district: string,
    setCampus: UseStateFunc<Option[]>
) => {
    try {
        const response = (await privateGateway.post(
            onboardingRoutes.collegeList,
            {
                district: district
            }
        )) as APIResponse<{ colleges: { id: string; title: string }[] }>;
        const colleges = response.data.response.colleges;
        setCampus(
            colleges
                .sort((a, b) => a.title.localeCompare(b.title))
                .map(college => ({
                    value: college.id,
                    label: college.title
                }))
        );
    } catch (err: unknown) {
        const error = err as AxiosError;
        if (error?.response) {
            throw error;
        }
    }
};

export const getInterestGroups = async () => {
    try {
        const response = (await privateGateway.get(dashboardRoutes.getCampusIg))
            ?.data?.response.interestGroup as { id: string; name: string }[];
        return response?.map(obj => ({
            value: obj.id,
            label: obj.name
        }));
    } catch (err) {
        const error = err as AxiosError;
        if (error?.response) {
            console.log(error.response);
        }
    }
};

export const getCount = async (setCount: Dispatch<any>) => {
    try {
        const response = await privateGateway.get(dashboardRoutes.getCount);
        setCount(response.data.response);
    } catch (err: unknown) {
        const error = err as AxiosError;
        if (error?.response) {
            throw error;
        }
    }
};
