-- Create table for Chipi conversations
CREATE TABLE IF NOT EXISTS public.chipi_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  mabot_chat_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for Chipi messages
CREATE TABLE IF NOT EXISTS public.chipi_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.chipi_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content_type TEXT NOT NULL CHECK (content_type IN ('text', 'audio', 'document')),
  content_text TEXT,
  content_metadata JSONB, -- For storing file info, audio transcriptions, etc.
  mabot_message_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chipi_conversations_user_id ON public.chipi_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chipi_conversations_session_id ON public.chipi_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_chipi_messages_conversation_id ON public.chipi_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chipi_messages_created_at ON public.chipi_messages(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE public.chipi_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chipi_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chipi_conversations
CREATE POLICY "Users can view their own conversations" ON public.chipi_conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations" ON public.chipi_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" ON public.chipi_conversations
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for chipi_messages
CREATE POLICY "Users can view messages from their conversations" ON public.chipi_messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM public.chipi_conversations 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages to their conversations" ON public.chipi_messages
  FOR INSERT WITH CHECK (
    conversation_id IN (
      SELECT id FROM public.chipi_conversations 
      WHERE user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_chipi_conversations_updated_at 
  BEFORE UPDATE ON public.chipi_conversations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 