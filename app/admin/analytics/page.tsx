'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Chart } from '@/components/ui/chart'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Activity, 
  Server, 
  Database,
  Globe,
  Shield,
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye
} from 'lucide-react'

const performanceMetrics = [
  { title: 'CPU Usage', value: '67%', change: '+5.3%', trend: 'up', icon: Activity, color: 'text-blue-500' },
  { title: 'Memory Usage', value: '45%', change: '-2.1%', trend: 'down', icon: Server, color: 'text-green-500' },
  { title: 'Storage Usage', value: '23%', change: '+1.8%', trend: 'up', icon: Database, color: 'text-purple-500' },
  { title: 'Network Load', value: '89%', change: '+12.5%', trend: 'up', icon: Globe, color: 'text-orange-500' },
]

const systemHealth = [
  { service: 'Database', status: 'Healthy', uptime: '99.9%', response: '12ms', icon: Database, color: 'text-green-500' },
  { service: 'API Gateway', status: 'Healthy', uptime: '99.8%', response: '45ms', icon: Server, color: 'text-green-500' },
  { service: 'Payment Service', status: 'Warning', uptime: '98.5%', response: '120ms', icon: Shield, color: 'text-yellow-500' },
  { service: 'Email Service', status: 'Healthy', uptime: '99.7%', response: '28ms', icon: Globe, color: 'text-green-500' },
]

const errorLogs = [
  { level: 'Error', message: 'Database connection timeout', service: 'Database', time: '2 minutes ago', count: 3 },
  { level: 'Warning', message: 'High memory usage detected', service: 'System', time: '15 minutes ago', count: 1 },
  { level: 'Info', message: 'Backup completed successfully', service: 'Backup', time: '1 hour ago', count: 1 },
  { level: 'Error', message: 'Payment gateway timeout', service: 'Payment', time: '2 hours ago', count: 5 },
]

const performanceData = [
  { name: '00:00', cpu: 45, memory: 38, network: 67 },
  { name: '04:00', cpu: 52, memory: 42, network: 71 },
  { name: '08:00', cpu: 78, memory: 58, network: 89 },
  { name: '12:00', cpu: 89, memory: 67, network: 92 },
  { name: '16:00', cpu: 76, memory: 61, network: 85 },
  { name: '20:00', cpu: 63, memory: 49, network: 73 },
  { name: '24:00', cpu: 48, memory: 41, network: 68 },
]

const userActivityData = [
  { name: 'Mon', active: 1850, new: 120, returning: 1730 },
  { name: 'Tue', active: 1920, new: 135, returning: 1785 },
  { name: 'Wed', active: 1980, new: 142, returning: 1838 },
  { name: 'Thu', active: 2050, new: 158, returning: 1892 },
  { name: 'Fri', active: 2180, new: 167, returning: 2013 },
  { name: 'Sat', active: 1950, new: 89, returning: 1861 },
  { name: 'Sun', active: 1820, new: 76, returning: 1744 },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('Last 24 Hours')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Healthy': return 'text-green-600'
      case 'Warning': return 'text-yellow-600'
      case 'Error': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Error': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'Warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'Info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">System Analytics</h1>
          <p className="text-muted-foreground">Monitor system performance and health metrics</p>
        </div>
        <Button variant="outline">
          {timeRange}
          <Clock className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric) => (
          <Card key={metric.title} className="bg-card border-border hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  <p className={`text-sm ${metric.color} flex items-center`}>
                    {metric.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    {metric.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-muted ${metric.color}`}>
                  <metric.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Performance Over Time */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">System Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart 
              data={performanceData.map(item => ({ name: item.name, CPU: item.cpu, Memory: item.memory, Network: item.network }))} 
              type="line" 
              height={300} 
            />
          </CardContent>
        </Card>

        {/* User Activity */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">User Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart 
              data={userActivityData.map(item => ({ name: item.name, Active: item.active, New: item.new, Returning: item.returning }))} 
              type="bar" 
              height={300} 
            />
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {systemHealth.map((service) => (
              <div key={service.service} className="p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <service.icon className={`w-5 h-5 ${service.color}`} />
                  <h3 className="font-medium text-foreground">{service.service}</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className={`text-sm font-medium ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Uptime</span>
                    <span className="text-sm font-medium text-foreground">{service.uptime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Response</span>
                    <span className="text-sm font-medium text-foreground">{service.response}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Error Logs */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Error Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {errorLogs.map((log, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(log.level)}`}>
                    {log.level}
                  </span>
                  <div>
                    <p className="font-medium text-foreground">{log.message}</p>
                    <p className="text-sm text-muted-foreground">
                      {log.service} • {log.time} • {log.count} occurrence(s)
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Zap className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-border hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Database className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Database Backup</h3>
            <p className="text-sm text-muted-foreground mb-4">Create a new backup of the database</p>
            <Button className="w-full bg-primary hover:bg-primary/90">
              Start Backup
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Server className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">System Maintenance</h3>
            <p className="text-sm text-muted-foreground mb-4">Schedule system maintenance window</p>
            <Button className="w-full bg-primary hover:bg-primary/90">
              Schedule
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Security Scan</h3>
            <p className="text-sm text-muted-foreground mb-4">Run security vulnerability scan</p>
            <Button className="w-full bg-primary hover:bg-primary/90">
              Start Scan
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}











