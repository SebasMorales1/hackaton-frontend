export interface ResourceData {
  id: number;
  name: string;
  category: "food" | "oxygen" | "water" | "spare_parts";
}

export interface Resource {
  id: number;
  quantity: number;
  resourceDataId: number;
  resourceData: ResourceData;
  minimumLevel: number;
  criticalLevel: number;
  maximumLevel: number;
  unit: "L" | "kg" | "u";
}
