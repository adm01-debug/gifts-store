-- Create table to store known devices per user
CREATE TABLE public.user_known_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  device_fingerprint TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  browser_name TEXT,
  os_name TEXT,
  device_type TEXT,
  location TEXT,
  first_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_trusted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, device_fingerprint)
);

-- Create table for device login notifications
CREATE TABLE public.device_login_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  device_id UUID REFERENCES public.user_known_devices(id) ON DELETE CASCADE,
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  location TEXT,
  notification_sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  email_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_known_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_login_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_known_devices
CREATE POLICY "Users can view their own devices"
ON public.user_known_devices
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own devices"
ON public.user_known_devices
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own devices"
ON public.user_known_devices
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own devices"
ON public.user_known_devices
FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for device_login_notifications
CREATE POLICY "Users can view their own notifications"
ON public.device_login_notifications
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
ON public.device_login_notifications
FOR INSERT
WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_user_known_devices_user_fingerprint ON public.user_known_devices(user_id, device_fingerprint);
CREATE INDEX idx_user_known_devices_user_ip ON public.user_known_devices(user_id, ip_address);