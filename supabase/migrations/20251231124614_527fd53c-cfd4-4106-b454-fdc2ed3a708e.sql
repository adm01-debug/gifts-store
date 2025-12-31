-- Create table to store WebAuthn/Passkey credentials
CREATE TABLE public.user_passkeys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  credential_id TEXT NOT NULL UNIQUE,
  public_key TEXT NOT NULL,
  counter INTEGER NOT NULL DEFAULT 0,
  device_name TEXT,
  transports TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_used_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.user_passkeys ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own passkeys"
ON public.user_passkeys
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own passkeys"
ON public.user_passkeys
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own passkeys"
ON public.user_passkeys
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own passkeys"
ON public.user_passkeys
FOR DELETE
USING (auth.uid() = user_id);

-- Index for faster lookups
CREATE INDEX idx_user_passkeys_user_id ON public.user_passkeys(user_id);
CREATE INDEX idx_user_passkeys_credential_id ON public.user_passkeys(credential_id);