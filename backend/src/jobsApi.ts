import * as fs from 'fs';
import * as path from 'path';
import express, { Request, Response, Router, RequestHandler, NextFunction } from 'express';
import * as dotenv from "dotenv";

dotenv.config()

const jobsApiKey : string = process.env.API_KEY || "";

const readJsonFile = (): Promise<any> => {
  const filePath = path.join(__dirname, 'cache.json');
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err : any, data : string) => {
      if (err) {
        return reject(err);
      }
      try {
        const jsonData = JSON.parse(data);
        resolve(jsonData);
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
};

const fetchJobs = async (searchQuery : string) => {
  try {
    const response = await fetch('https://api.theirstack.com/v1/jobs/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jobsApiKey}`
      },
      body: JSON.stringify({
        order_by: [
          {
            desc: true,
            field: 'date_posted'
          },
          {
            desc: true,
            field: 'discovered_at'
          }
        ],
        page: 0,
        limit: 5,
        company_description_pattern_or: [],
        company_description_pattern_not: [],
        company_description_pattern_accent_insensitive: false,
        min_revenue_usd: null,
        max_revenue_usd: null,
        min_employee_count: null,
        max_employee_count: null,
        min_employee_count_or_null: null,
        max_employee_count_or_null: null,
        min_funding_usd: null,
        max_funding_usd: null,
        funding_stage_or: [],
        industry_or: [],
        industry_not: [],
        industry_id_or: [],
        industry_id_not: [],
        company_tags_or: [],
        company_type: 'all',
        company_investors_or: [],
        company_investors_partial_match_or: [],
        company_technology_slug_or: [],
        company_technology_slug_and: [],
        company_technology_slug_not: [],
        only_yc_companies: false,
        company_location_pattern_or: [],
        company_country_code_or: [],
        company_country_code_not: [],
        company_list_id_or: [],
        company_list_id_not: [],
        company_linkedin_url_exists: null,
        revealed_company_data: null,
        company_name_or: [],
        company_name_case_insensitive_or: [],
        company_id_or: [],
        company_domain_or: [],
        company_domain_not: [],
        company_name_not: [],
        company_name_partial_match_or: [],
        company_name_partial_match_not: [],
        company_linkedin_url_or: [],
        job_title_or: [searchQuery],
        job_title_not: [],
        job_title_pattern_and: [],
        job_title_pattern_or: [],
        job_title_pattern_not: [],
        job_country_code_or: [],
        job_country_code_not: [],
        posted_at_max_age_days: 100,
        posted_at_gte: null,
        posted_at_lte: null,
        discovered_at_max_age_days: null,
        discovered_at_min_age_days: null,
        discovered_at_gte: null,
        discovered_at_lte: null,
        job_description_pattern_or: [],
        job_description_pattern_not: [],
        job_description_pattern_is_case_insensitive: true,
        remote: null,
        only_jobs_with_reports_to: null,
        reports_to_exists: null,
        final_url_exists: null,
        only_jobs_with_hiring_managers: null,
        hiring_managers_exists: null,
        job_id_or: [],
        job_ids: [],
        min_salary_usd: null,
        max_salary_usd: null,
        job_technology_slug_or: [],
        job_technology_slug_not: [],
        job_technology_slug_and: [],
        job_location_pattern_or: [],
        job_location_pattern_not: [],
        scraper_name_pattern_or: [],
        include_total_results: false,
        blur_company_data: false,
        group_by: []
      })
    });

    if (!response.ok) {
      const result = await response.json();
      console.log(result);
      throw new Error(`Error: ${response.status}`);
    }

    const body = await response.json(); // Convert response to JSON
    return body;
  } catch (error : any) {
    console.error('Fetch error:', error.message);
  }
};

const jobsRouter: Router = express.Router();

const fetchJobsHandler: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { q } = req.body;
    if (!q) {
      res.status(400).json({ message: 'Query required' });
      return
    }
  console.log(jobsApiKey)
    const result = await fetchJobs(q)
    res.json(result)
};

jobsRouter.post("/jobs", fetchJobsHandler)

export default jobsRouter;
