import type { NextApiRequest, NextApiResponse } from 'next'

interface TrackData {
  job_id: string
  company: string
  platform: string
  timestamp: number
}

/**
 * 联盟链接点击追踪API
 * 记录用户点击哪个联盟链接，用于优化转化率
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const data: TrackData = req.body

    // TODO: 实际项目中应该保存到数据库或分析服务
    // 可以用：
    // 1. Supabase（免费500MB）
    // 2. Google Analytics Events
    // 3. 简单的JSON文件追加（GitHub Actions提交）
    
    console.log('📊 Affiliate Click Tracked:', {
      job_id: data.job_id,
      company: data.company,
      platform: data.platform,
      timestamp: new Date(data.timestamp).toISOString(),
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent']
    })

    // 示例：可以发送到Google Analytics
    // if (process.env.GA_MEASUREMENT_ID) {
    //   await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA_MEASUREMENT_ID}&api_secret=${process.env.GA_API_SECRET}`, {
    //     method: 'POST',
    //     body: JSON.stringify({
    //       client_id: 'anonymous',
    //       events: [{
    //         name: 'affiliate_click',
    //         params: {
    //           platform: data.platform,
    //           company: data.company
    //         }
    //       }]
    //     })
    //   })
    // }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Track error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

