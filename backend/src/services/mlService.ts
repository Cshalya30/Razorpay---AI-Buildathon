import axios from "axios";
import { Mandate, Customer, BalancePoint } from "../db/queries";

export interface CandidateDay {
  day: number;
  prob: number;
}

export interface PredictResponse {
  best_day: number;
  predicted_success_prob: number;
  candidate_days: CandidateDay[];
  feature_importances: Record<string, number>;
}

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

export class MLService {
  /**
   * Calls the FastAPI /predict endpoint to obtain candidate day probabilities.
   * Fails loudly on network or contract errors.
   */
  public async predictRetry(
    mandate: Mandate,
    customer: Customer,
    balancePoints: BalancePoint[]
  ): Promise<PredictResponse> {
    const balanceCurve: Record<number, number> = {};
    for (const p of balancePoints) {
      balanceCurve[p.day] = p.balance;
    }

    const payload = {
      mandate_id: mandate.id,
      mandate_amount: mandate.mandate_amount,
      category: mandate.category,
      due_day: mandate.due_day,
      attempts: mandate.attempts,
      customer_id: customer.id,
      monthly_inflow: customer.salary_amount,
      credit_days: customer.credit_days || "",
      credit_amounts: customer.credit_amounts || "",
      balance_curve: balanceCurve
    };

    try {
      const response = await axios.post<PredictResponse>(`${ML_SERVICE_URL}/predict`, payload, {
        timeout: 2000
      });
      return response.data;
    } catch (err: any) {
      // Fail loudly with actionable error details
      const msg = err.response?.data?.detail || err.message;
      throw new Error(`ML Service prediction failed for ${mandate.id} on ${ML_SERVICE_URL}/predict: ${msg}`);
    }
  }

  public async getFeatureImportances(): Promise<{ feature_importances: Record<string, number>; auc_score: number }> {
    const response = await axios.get(`${ML_SERVICE_URL}/model/feature-importances`, { timeout: 2000 });
    return response.data;
  }
}

export const mlService = new MLService();
