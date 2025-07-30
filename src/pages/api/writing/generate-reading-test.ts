import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { preferences, userId } = await request.json();

  try {
    // 1. Call AI service to generate test content
    // This would be an integration with OpenAI or similar service
    const generatedTest = await generateTestWithAI(preferences);

    // 2. Save the generated test to Supabase
    const { data: test, error } = await supabase
      .from('reading_papers')
      .insert({
        title: generatedTest.title,
        difficulty: preferences.difficulty,
        duration_minutes: 60,
        question_count: generatedTest.questions.length,
        description: `AI-generated test on ${preferences.topic || 'general topic'}`,
        reading_passages: generatedTest.passages,
        generated_by: userId
      })
      .select('id')
      .single();

    if (error) throw error;

    // 3. Update user's test count (if premium)
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_premium')
      .eq('id', userId)
      .single();

    if (profile?.is_premium) {
      await supabase.rpc('increment_test_count', { user_id: userId });
    }

    return NextResponse.json({ testId: test.id });
  } catch (error) {
    console.error('Test generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate test' },
      { status: 500 }
    );
  }
}

// Mock function - replace with actual AI integration
async function generateTestWithAI(preferences: any) {
  // This would call OpenAI API to generate passages and questions
  // Return the test in the required format

  return {
    title: `AI-Generated Test: ${preferences.topic || 'General Reading'}`,
    passages: [
      {
        passage_number: 1,
        title: "The Future of Renewable Energy",
        body: "Renewable energy sources are becoming increasingly important...",
        section_instruction: "Read the passage and answer the questions...",
        reading_questions: [
          {
            question_number: 1,
            question_type: "multiple_choice",
            text: "What is the main topic of the passage?",
            options: ["A) Solar power", "B) Wind energy", "C) Renewable energy", "D) Fossil fuels"],
            answer: "C"
          },
          // More questions...
        ]
      }
    ],
    questions: [] // Full list of questions
  };
}