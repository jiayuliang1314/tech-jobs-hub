/**
 * 联盟链接生成工具
 * 核心盈利模块 - 生成Indeed/ZipRecruiter/Glassdoor联盟链接
 */

export interface Job {
  id: string
  title: string
  company: string
  location: string
  url: string
  description?: string
  updated_at?: string
}

export interface AffiliateLinks {
  indeed: string
  ziprecruiter: string
  glassdoor: string
  glassdoorSalary: string
}

export class AffiliateManager {
  private indeedPublisherId: string
  private ziprecruiterAid: string
  private cjAffiliateId: string

  constructor() {
    this.indeedPublisherId = process.env.INDEED_PUBLISHER_ID || ''
    this.ziprecruiterAid = process.env.ZIPRECRUITER_AID || ''
    this.cjAffiliateId = process.env.CJ_AFFILIATE_ID || ''
  }

  /**
   * 生成Indeed联盟链接（主要收入来源：$0.50-1.50/点击）
   */
  generateIndeedLink(job: Job): string {
    const query = encodeURIComponent(`${job.title} ${job.company}`)
    const location = encodeURIComponent(job.location)
    
    return `https://www.indeed.com/jobs?q=${query}&l=${location}&from=${this.indeedPublisherId}&utm_source=affiliate&utm_medium=jobboard`
  }

  /**
   * 生成ZipRecruiter联盟链接（$5-15/注册）
   */
  generateZipRecruiterLink(job: Job): string {
    const search = encodeURIComponent(job.title)
    const location = encodeURIComponent(job.location)
    
    return `https://www.ziprecruiter.com/candidate/search?search=${search}&location=${location}&aid=${this.ziprecruiterAid}`
  }

  /**
   * 生成Glassdoor公司页面联盟链接（$0.50-2.00/点击）
   * 通过CJ Affiliate
   */
  generateGlassdoorCompanyLink(company: string): string {
    const companySlug = company.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const targetUrl = `https://www.glassdoor.com/Overview/Working-at-${companySlug}.htm`
    
    // CJ Affiliate Deep Link格式
    return `https://www.anrdoezrs.net/links/${this.cjAffiliateId}/type/dlg/${encodeURIComponent(targetUrl)}`
  }

  /**
   * 生成Glassdoor薪资页面联盟链接
   */
  generateGlassdoorSalaryLink(job: Job): string {
    const titleSlug = job.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const companySlug = job.company.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const targetUrl = `https://www.glassdoor.com/Salary/${companySlug}-${titleSlug}-Salaries.htm`
    
    return `https://www.anrdoezrs.net/links/${this.cjAffiliateId}/type/dlg/${encodeURIComponent(targetUrl)}`
  }

  /**
   * 生成所有联盟链接
   */
  generateAllLinks(job: Job): AffiliateLinks {
    return {
      indeed: this.generateIndeedLink(job),
      ziprecruiter: this.generateZipRecruiterLink(job),
      glassdoor: this.generateGlassdoorCompanyLink(job.company),
      glassdoorSalary: this.generateGlassdoorSalaryLink(job),
    }
  }
}

// 导出单例
export const affiliateManager = new AffiliateManager()

