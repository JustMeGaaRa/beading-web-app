export const deepClone = <T>(instance: T): T => {
    return JSON.parse(JSON.stringify(instance)) as T;
};

export const toJsonUri = (instance: any) => {
    const patternJson = JSON.stringify(instance, null, 2);
    const blob = new Blob([patternJson], { type: "application/json" });
    return URL.createObjectURL(blob);
};

export const downloadUri = (uri: string, name: string) => {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
