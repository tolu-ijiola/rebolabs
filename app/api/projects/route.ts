import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { projectService } from '@/lib/services/supabase-service'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    // Get user from auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projects = await projectService.getProjects(user.id)
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    // Get user from auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate required fields
    const { name, link, currency_name } = body
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 })
    }
    if (name.trim().length > 100) {
      return NextResponse.json({ error: 'Project name must be 100 characters or less' }, { status: 400 })
    }
    if (!link || typeof link !== 'string' || link.trim().length === 0) {
      return NextResponse.json({ error: 'Project URL is required' }, { status: 400 })
    }
    if (!currency_name || typeof currency_name !== 'string' || currency_name.trim().length === 0) {
      return NextResponse.json({ error: 'Currency name is required' }, { status: 400 })
    }

    // Check for duplicate project name for this user
    const supabaseAdmin = createServerClient()
    const { data: existing } = await supabaseAdmin
      .from('projects')
      .select('id')
      .eq('user_id', user.id)
      .ilike('name', name.trim())
      .limit(1)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'A project with this name already exists' }, { status: 409 })
    }

    const project = await projectService.createProject({
      ...body,
      name: name.trim(),
      link: link.trim(),
      currency_name: currency_name.trim(),
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
