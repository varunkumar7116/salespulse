// lib/ai-insights.ts
// Rule-based AI narrative engine: analyzes computed metrics and generates business insights

import { KPIs, SalesAnalytics, ProductAnalytics, CustomerAnalytics, ProfitAnalytics, InventoryAnalytics } from "./data-processor";
import { formatCurrency } from "./data-processor";

export interface BusinessInsights {
  executiveSummary: string;
  keyFindings: Finding[];
  swot: SWOT;
  recommendations: Recommendation[];
  alerts: Alert[];
  nlqAnswer?: string;
}

export interface Finding {
  title: string;
  description: string;
  type: "positive" | "negative" | "neutral";
  impact: "high" | "medium" | "low";
  metric?: string;
  value?: string;
}

export interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface Recommendation {
  category: "sales" | "product" | "customer" | "inventory" | "pricing" | "marketing";
  title: string;
  description: string;
  priority: "critical" | "high" | "medium" | "low";
  expectedImpact: string;
  action: string;
}

export interface Alert {
  type: "danger" | "warning" | "info" | "success";
  title: string;
  message: string;
  metric?: string;
}

export function generateInsights(
  kpis: KPIs,
  sales?: SalesAnalytics,
  products?: ProductAnalytics,
  customers?: CustomerAnalytics,
  profit?: ProfitAnalytics,
  inventory?: InventoryAnalytics
): BusinessInsights {
  const alerts = generateAlerts(kpis, inventory, customers);
  const keyFindings = generateFindings(kpis, sales, products, customers);
  const swot = generateSWOT(kpis, sales, products, customers, inventory);
  const recommendations = generateRecommendations(kpis, products, customers, inventory);
  const executiveSummary = generateExecutiveSummary(kpis, keyFindings, alerts);

  return { executiveSummary, keyFindings, swot, recommendations, alerts };
}

function generateExecutiveSummary(kpis: KPIs, findings: Finding[], alerts: Alert[]): string {
  const trend = kpis.revenueGrowth >= 0 ? "positive" : "declining";
  const margin = kpis.profitMargin;
  const healthStatus = margin > 20 ? "strong" : margin > 10 ? "moderate" : "concerning";
  const criticalAlerts = alerts.filter((a) => a.type === "danger").length;

  return `Your business generated ${formatCurrency(kpis.totalRevenue)} in total revenue with ${formatCurrency(kpis.totalProfit)} in profit, achieving a ${kpis.profitMargin}% profit margin — indicating ${healthStatus} financial health. Revenue showed a ${trend} trend with a ${Math.abs(kpis.revenueGrowth)}% ${kpis.revenueGrowth >= 0 ? "growth" : "decline"} compared to the previous period. You served ${kpis.totalCustomers.toLocaleString()} unique customers across ${kpis.totalOrders.toLocaleString()} orders, with an average order value of ${formatCurrency(kpis.averageOrderValue)}. ${criticalAlerts > 0 ? `⚠️ There are ${criticalAlerts} critical issue(s) requiring immediate attention.` : "✅ No critical issues detected."} The top performing category is "${kpis.topCategory}" and the strongest region is "${kpis.topRegion}". ${findings.filter((f) => f.type === "positive").length} positive trends and ${findings.filter((f) => f.type === "negative").length} areas of concern were identified.`;
}

function generateFindings(
  kpis: KPIs,
  sales?: SalesAnalytics,
  products?: ProductAnalytics,
  customers?: CustomerAnalytics
): Finding[] {
  const findings: Finding[] = [];

  // Revenue trend
  if (kpis.revenueGrowth > 10) {
    findings.push({ title: "Strong Revenue Growth", description: `Revenue grew by ${kpis.revenueGrowth}% compared to the previous period, significantly outpacing average industry growth of 5-8%.`, type: "positive", impact: "high", metric: "Revenue Growth", value: `+${kpis.revenueGrowth}%` });
  } else if (kpis.revenueGrowth < -5) {
    findings.push({ title: "Revenue Decline Detected", description: `Revenue dropped by ${Math.abs(kpis.revenueGrowth)}% compared to the prior period. Immediate investigation recommended.`, type: "negative", impact: "high", metric: "Revenue Growth", value: `${kpis.revenueGrowth}%` });
  } else {
    findings.push({ title: "Stable Revenue Performance", description: `Revenue shows marginal ${kpis.revenueGrowth >= 0 ? "growth" : "decline"} of ${Math.abs(kpis.revenueGrowth)}%. There is headroom for improvement through upselling and new customer acquisition.`, type: "neutral", impact: "medium", metric: "Revenue Growth", value: `${kpis.revenueGrowth}%` });
  }

  // Profit margin
  if (kpis.profitMargin > 25) {
    findings.push({ title: "Excellent Profit Margin", description: `A ${kpis.profitMargin}% profit margin is exceptional and well above the industry average of 10-15%. Your pricing strategy and cost control are working effectively.`, type: "positive", impact: "high", metric: "Profit Margin", value: `${kpis.profitMargin}%` });
  } else if (kpis.profitMargin < 10) {
    findings.push({ title: "Low Profit Margin Alert", description: `At ${kpis.profitMargin}%, your profit margin is below healthy levels. Consider reviewing pricing, reducing COGS, or cutting low-margin products.`, type: "negative", impact: "high", metric: "Profit Margin", value: `${kpis.profitMargin}%` });
  }

  // Customer retention
  if (customers) {
    const retentionPct = (customers.returning / customers.total) * 100;
    if (retentionPct > 40) {
      findings.push({ title: "Strong Customer Retention", description: `${retentionPct.toFixed(0)}% of customers made repeat purchases, indicating strong brand loyalty and customer satisfaction.`, type: "positive", impact: "high", metric: "Retention Rate", value: `${retentionPct.toFixed(0)}%` });
    } else {
      findings.push({ title: "Customer Retention Needs Attention", description: `Only ${retentionPct.toFixed(0)}% of customers returned for repeat purchases. Consider implementing loyalty programs and personalized marketing.`, type: "negative", impact: "medium", metric: "Retention Rate", value: `${retentionPct.toFixed(0)}%` });
    }
    if (customers.churnRate > 20) {
      findings.push({ title: "High Customer Churn Rate", description: `${customers.churnRate.toFixed(1)}% of customers haven't purchased in 90+ days. Proactive re-engagement campaigns are needed.`, type: "negative", impact: "high", metric: "Churn Rate", value: `${customers.churnRate.toFixed(1)}%` });
    }
  }

  // Loss orders
  if (kpis.lossPercentage > 5) {
    findings.push({ title: "Loss-Making Orders Detected", description: `${kpis.lossPercentage.toFixed(1)}% of orders resulted in losses. Review high-discount policies and cost structures for affected products.`, type: "negative", impact: "medium", metric: "Loss Orders", value: `${kpis.lossPercentage.toFixed(1)}%` });
  }

  // Top category
  findings.push({ title: `"${kpis.topCategory}" is Your Star Category`, description: `This category generates the highest revenue, suggesting strong market positioning. Consider expanding this product line or cross-selling complementary products.`, type: "positive", impact: "medium", metric: "Top Category", value: kpis.topCategory });

  // Products
  if (products) {
    const abcA = products.abcAnalysis.filter((p) => p.class === "A").length;
    const total = products.abcAnalysis.length;
    findings.push({ title: `${abcA} Products Drive 80% of Revenue`, description: `ABC analysis shows ${abcA} of ${total} products (${Math.round((abcA / total) * 100)}%) generate 80% of revenue. Focus on protecting and growing these critical SKUs.`, type: "positive", impact: "high", metric: "ABC Analysis", value: `${abcA} Class-A` });
  }

  return findings;
}

function generateSWOT(
  kpis: KPIs,
  sales?: SalesAnalytics,
  products?: ProductAnalytics,
  customers?: CustomerAnalytics,
  inventory?: InventoryAnalytics
): SWOT {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const opportunities: string[] = [];
  const threats: string[] = [];

  // Strengths
  if (kpis.profitMargin > 15) strengths.push(`Strong profit margin of ${kpis.profitMargin}% above industry average`);
  if (kpis.revenueGrowth > 5) strengths.push(`Healthy revenue growth trajectory of ${kpis.revenueGrowth}%`);
  if (customers && customers.returning / customers.total > 0.35) strengths.push("High customer loyalty with strong repeat purchase rate");
  if (kpis.totalCustomers > 100) strengths.push(`Diverse customer base of ${kpis.totalCustomers.toLocaleString()} customers`);
  if (kpis.averageOrderValue > 500) strengths.push(`High average order value of ${formatCurrency(kpis.averageOrderValue)} indicating premium positioning`);
  if (products && products.topProducts.length > 5) strengths.push(`Strong multi-product portfolio with diversified revenue streams`);
  strengths.push(`Dominant position in "${kpis.topCategory}" category with highest revenue contribution`);
  strengths.push(`Strong regional presence in "${kpis.topRegion}"`);

  // Weaknesses
  if (kpis.profitMargin < 10) weaknesses.push(`Below-average profit margin of ${kpis.profitMargin}% limiting reinvestment capacity`);
  if (kpis.lossPercentage > 5) weaknesses.push(`${kpis.lossPercentage.toFixed(1)}% of orders are loss-making, eroding overall profitability`);
  if (customers && customers.churnRate > 25) weaknesses.push(`High customer churn rate of ${customers.churnRate.toFixed(1)}% increasing acquisition costs`);
  if (inventory && inventory.deadStock.length > 5) weaknesses.push(`Dead stock accumulation tying up working capital`);
  if (kpis.totalDiscount / kpis.totalRevenue > 0.15) weaknesses.push("High dependency on discounting to drive sales");
  weaknesses.push("Geographic concentration risk in a limited number of regions");
  if (kpis.revenueGrowth < 0) weaknesses.push("Revenue decline indicating market share erosion");

  // Opportunities
  opportunities.push("Expand into emerging markets and new geographic regions");
  opportunities.push(`Upsell and cross-sell to ${kpis.returningCustomers} returning customers who already trust the brand`);
  if (customers && customers.newCustomers > 0) opportunities.push(`${customers.newCustomers} new customers this period can be converted to loyal buyers with proper onboarding`);
  opportunities.push("Introduce loyalty program to increase purchase frequency and reduce churn");
  opportunities.push("Leverage digital marketing and social commerce to reduce customer acquisition costs");
  if (products) opportunities.push("Launch premium product tiers in high-performing categories to improve margins");
  opportunities.push("Implement dynamic pricing to optimize revenue during peak demand periods");
  opportunities.push("Partner with complementary businesses for bundle offerings");

  // Threats
  threats.push("Rising cost of raw materials and supply chain disruptions impacting COGS");
  threats.push("Increasing competition in the primary category may compress margins");
  if (customers && customers.churnRate > 15) threats.push("High customer churn could signal growing competitive alternatives");
  threats.push("Economic uncertainty affecting consumer spending patterns and B2B budgets");
  threats.push("Regulatory changes in key markets could impact operations");
  if (inventory && inventory.outOfStock > 0) threats.push(`${inventory.outOfStock} products out of stock could drive customers to competitors`);
  threats.push("Over-reliance on a small set of products creates concentration risk");

  return { strengths, weaknesses, opportunities, threats };
}

function generateRecommendations(
  kpis: KPIs,
  products?: ProductAnalytics,
  customers?: CustomerAnalytics,
  inventory?: InventoryAnalytics
): Recommendation[] {
  const recs: Recommendation[] = [];

  // High priority
  if (kpis.lossPercentage > 5) {
    recs.push({
      category: "pricing",
      title: "Review Loss-Making Products Immediately",
      description: `${kpis.lossPercentage.toFixed(1)}% of orders are unprofitable. Identify products with negative margins and either reprice, renegotiate supplier costs, or discontinue.`,
      priority: "critical",
      expectedImpact: "Could improve overall profit margin by 3-8%",
      action: "Run profit analysis → filter loss-making products → review cost structure",
    });
  }

  if (customers && customers.churnRate > 20) {
    recs.push({
      category: "customer",
      title: "Launch Customer Re-engagement Campaign",
      description: `${customers.inactive.length} customers haven't purchased in 90+ days. A targeted email campaign with personalized offers could recover 15-25% of churned customers.`,
      priority: "high",
      expectedImpact: "Could recover 15-25% of churned customers and add revenue",
      action: "Segment inactive customers → create personalized offers → automate win-back emails",
    });
  }

  if (inventory && inventory.lowStock.length > 3) {
    recs.push({
      category: "inventory",
      title: "Reorder Low-Stock Items Urgently",
      description: `${inventory.lowStock.length} products are below reorder level and risk stockout. Prioritize reordering top-selling SKUs to prevent revenue loss.`,
      priority: "critical",
      expectedImpact: "Prevents potential revenue loss from stockouts",
      action: "Contact suppliers for listed low-stock items → place emergency purchase orders",
    });
  }

  // Medium priority
  recs.push({
    category: "sales",
    title: `Double Down on "${kpis.topRegion}" — Your Strongest Market`,
    description: `This region generates the highest revenue. Allocate more sales resources, run regional promotions, and consider expanding physical or digital presence.`,
    priority: "high",
    expectedImpact: "Could increase regional revenue by 15-30%",
    action: "Increase marketing budget for top region → assign dedicated sales reps",
  });

  if (products && products.abcAnalysis.filter(p => p.class === "C").length > 10) {
    recs.push({
      category: "product",
      title: "Rationalize Low-Performing Product Portfolio",
      description: `${products.abcAnalysis.filter(p => p.class === "C").length} products (Class C) contribute less than 5% of revenue but consume operational resources. Consider discontinuing or bundling them.`,
      priority: "medium",
      expectedImpact: "Reduce operational complexity and free up 10-15% of inventory capital",
      action: "Review Class C products → bundle with A/B products or phase out",
    });
  }

  recs.push({
    category: "customer",
    title: "Implement Customer Loyalty Program",
    description: "Returning customers spend 2-5x more than new customers. A points-based loyalty system can increase purchase frequency and average order value significantly.",
    priority: "high",
    expectedImpact: "Could increase customer lifetime value by 20-40%",
    action: "Design tier-based loyalty program → integrate with checkout → promote to existing customers",
  });

  recs.push({
    category: "marketing",
    title: "Focus Marketing on High-Value Customer Segments",
    description: "RFM analysis reveals your Champions and Loyal customer segments. Create premium experiences and exclusive offers for these high-value groups to maximize lifetime value.",
    priority: "medium",
    expectedImpact: "Could increase revenue from top 20% of customers by 25%",
    action: "Export RFM segments → create targeted campaigns → personalize communications",
  });

  recs.push({
    category: "pricing",
    title: "Optimize Discount Strategy",
    description: `High discounting is reducing effective margins. Test smaller, more targeted discounts (5-10%) for specific segments rather than blanket discounts across all products.`,
    priority: "medium",
    expectedImpact: "Could improve net margin by 2-5%",
    action: "A/B test discount levels → analyze discount elasticity → adjust pricing tiers",
  });

  recs.push({
    category: "sales",
    title: "Expand Salesperson Performance Programs",
    description: "Your top salesperson analysis shows significant performance variance. Implement structured training and mentoring to bring mid-performers closer to top-performer levels.",
    priority: "low",
    expectedImpact: "Could increase overall sales team output by 15-20%",
    action: "Identify top performers → document their sales processes → create training programs",
  });

  return recs;
}

function generateAlerts(kpis: KPIs, inventory?: InventoryAnalytics, customers?: CustomerAnalytics): Alert[] {
  const alerts: Alert[] = [];

  if (kpis.revenueGrowth < -10) {
    alerts.push({ type: "danger", title: "Revenue Dropping Sharply", message: `Revenue declined by ${Math.abs(kpis.revenueGrowth)}% — immediate action required to identify root cause.`, metric: `${kpis.revenueGrowth}%` });
  }

  if (kpis.profitMargin < 5) {
    alerts.push({ type: "danger", title: "Critical: Near-Zero Profit Margin", message: `Profit margin is only ${kpis.profitMargin}%. Business is at risk of operating at a loss.`, metric: `${kpis.profitMargin}%` });
  }

  if (kpis.lossPercentage > 10) {
    alerts.push({ type: "danger", title: "High Loss Order Rate", message: `${kpis.lossPercentage.toFixed(1)}% of all orders are loss-making. Review pricing and cost structures immediately.`, metric: `${kpis.lossPercentage.toFixed(1)}%` });
  }

  if (inventory) {
    if (inventory.outOfStock > 0) {
      alerts.push({ type: "danger", title: "Products Out of Stock", message: `${inventory.outOfStock} products have zero inventory. Revenue loss is occurring right now.`, metric: `${inventory.outOfStock} SKUs` });
    }
    if (inventory.lowStock.length > 5) {
      alerts.push({ type: "warning", title: "Low Inventory Warning", message: `${inventory.lowStock.length} products are below reorder levels. Stockouts may occur within days.`, metric: `${inventory.lowStock.length} items` });
    }
    if (inventory.deadStock.length > 0) {
      alerts.push({ type: "warning", title: "Dead Stock Detected", message: `${inventory.deadStock.length} products have inventory but no recent sales — capital is tied up.`, metric: `${inventory.deadStock.length} SKUs` });
    }
  }

  if (customers && customers.churnRate > 25) {
    alerts.push({ type: "warning", title: "High Customer Churn Rate", message: `${customers.churnRate.toFixed(1)}% of customers haven't purchased recently. Consider a re-engagement campaign.`, metric: `${customers.churnRate.toFixed(1)}%` });
  }

  if (kpis.revenueGrowth > 15) {
    alerts.push({ type: "success", title: "Excellent Revenue Growth!", message: `Revenue grew by ${kpis.revenueGrowth}% — your business is performing above benchmark.`, metric: `+${kpis.revenueGrowth}%` });
  }

  if (kpis.profitMargin > 25) {
    alerts.push({ type: "success", title: "Outstanding Profit Margin", message: `Your ${kpis.profitMargin}% margin is exceptional — well above the industry average of 10-15%.`, metric: `${kpis.profitMargin}%` });
  }

  if (alerts.length === 0) {
    alerts.push({ type: "info", title: "Business Running Smoothly", message: "No critical alerts detected. Continue monitoring KPIs and look for optimization opportunities." });
  }

  return alerts;
}

// ─── Natural Language Query Handler ─────────────────
export function answerNLQ(
  query: string,
  kpis: KPIs,
  sales?: SalesAnalytics,
  products?: ProductAnalytics,
  customers?: CustomerAnalytics
): string {
  const q = query.toLowerCase();

  if (q.includes("top") && q.includes("product")) {
    const tops = products?.topProducts.slice(0, 5).map((p, i) => `${i + 1}. ${p.name} — ${formatCurrency(p.revenue)}`).join("\n") || "No product data available.";
    return `🏆 **Top 5 Products by Revenue:**\n\n${tops}\n\nThe best-selling product is **${products?.topProducts[0]?.name}** in the **${products?.topProducts[0]?.category}** category.`;
  }

  if (q.includes("highest sales") || q.includes("best region") || (q.includes("region") && (q.includes("highest") || q.includes("best")))) {
    const top = sales?.byRegion[0];
    return `📍 **${kpis.topRegion}** is your highest-performing region with ${formatCurrency(top?.revenue || 0)} in revenue and ${top?.orders || 0} orders. This region contributes the most to your overall business performance.`;
  }

  if (q.includes("profit") && (q.includes("decreas") || q.includes("dropp") || q.includes("low") || q.includes("why"))) {
    return `📉 **Profit Analysis:**\n\nYour current profit margin is ${kpis.profitMargin}% with ${formatCurrency(kpis.totalProfit)} total profit.\n\n**Likely causes of profit pressure:**\n• ${kpis.lossPercentage > 5 ? `${kpis.lossPercentage.toFixed(1)}% of orders are loss-making` : "Some orders have thin margins"}\n• High discount rates reducing effective selling price\n• Rising cost of goods sold\n• Competitive pricing pressure\n\n**Recommended actions:** Review product-level margins, adjust pricing, and renegotiate supplier contracts.`;
  }

  if (q.includes("customer") && (q.includes("stop") || q.includes("churn") || q.includes("inactive") || q.includes("why"))) {
    return `👥 **Customer Churn Analysis:**\n\nChurn rate: **${customers?.churnRate.toFixed(1) || "N/A"}%**\n\n**Reasons customers may have stopped buying:**\n• Price sensitivity or competitor offers\n• Unmet product expectations\n• Poor post-purchase experience\n• Seasonal buying patterns\n\n**Re-engagement strategy:** Send personalized win-back emails with a special offer to ${customers?.inactive.length || 0} inactive customers.`;
  }

  if (q.includes("improve") || q.includes("suggest") || q.includes("recommend")) {
    return `💡 **Top Improvement Recommendations:**\n\n1. **Pricing** — Review the ${kpis.lossPercentage.toFixed(0)}% of loss-making orders and reprice or discontinue\n2. **Retention** — Launch a loyalty program; returning customers spend 2-5x more\n3. **Geography** — Double marketing investment in "${kpis.topRegion}"\n4. **Products** — Focus on Class-A products that drive 80% of revenue\n5. **Discounting** — Reduce blanket discounts; use targeted promotions instead`;
  }

  if (q.includes("forecast") || q.includes("next month") || q.includes("predict")) {
    const growthLabel = kpis.revenueGrowth >= 0 ? "growth" : "decline";
    return `📈 **Sales Forecast:**\n\nBased on the ${growthLabel} trend of **${kpis.revenueGrowth}%**, the forecast model predicts:\n\n• **Next month:** ${formatCurrency(kpis.totalRevenue / 12 * (1 + kpis.revenueGrowth / 100))}\n• **Next quarter:** ${formatCurrency(kpis.totalRevenue / 4 * (1 + kpis.revenueGrowth / 100))}\n\nNavigate to the **Forecasting** module for detailed predictions with confidence intervals.`;
  }

  if (q.includes("revenue") && q.includes("total")) {
    return `💰 Total revenue is **${formatCurrency(kpis.totalRevenue)}** with a growth rate of **${kpis.revenueGrowth}%** compared to the previous period.`;
  }

  return `🤖 **AI Analysis:**\n\nBased on your data:\n• Total Revenue: **${formatCurrency(kpis.totalRevenue)}** (${kpis.revenueGrowth > 0 ? "+" : ""}${kpis.revenueGrowth}%)\n• Profit Margin: **${kpis.profitMargin}%**\n• Active Customers: **${kpis.totalCustomers.toLocaleString()}**\n• Top Category: **${kpis.topCategory}**\n\nTry asking: "Show top 10 products", "Why is profit decreasing?", "Which region has highest sales?", "What should I improve?"`;
}
