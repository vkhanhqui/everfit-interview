import { MetricRepo } from "../repositories/MetricRepo";
import { MetricCreateInput } from "../dto/metrics/create.input";
import { Metric } from "../models/Metric";

export interface MetricService {
  create(input: MetricCreateInput): Promise<Metric>;
}

export class MetricServiceImp implements MetricService {
  constructor(private repo: MetricRepo) {}

  async create(input: MetricCreateInput) {
    return this.repo.create(input);
  }
}
