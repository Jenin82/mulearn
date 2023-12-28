export const customStyles: any = {
    control: (provided: any) => ({
        ...provided,
        backgroundColor: "#F3F3F4",
        border: "none",
        borderRadius: "10px",
        fontSize: "12px",
        fontWeight: "bold",
        color: "#000",
        width: "100%",
        padding: ".3rem .4rem",
        minWidth: "200px"
    }),
    placeholder: (provided: any) => ({
        ...provided,
        color: "#000"
    }),
    indicatorSeparator: (provided: any) => ({
        ...provided,
        display: "none"
    })
};