import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function SupabaseTest() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [message, setMessage] = useState('Testing connection...');

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setStatus('error');
          setMessage(`Connection error: ${error.message}`);
        } else {
          setStatus('connected');
          setMessage('Successfully connected to Supabase!');
        }
      } catch (err) {
        setStatus('error');
        setMessage(`Connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }

    testConnection();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Supabase Connection Test</CardTitle>
          <CardDescription>Testing connection to your Supabase project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            {status === 'checking' && (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">{message}</span>
              </>
            )}
            {status === 'connected' && (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-green-500 font-medium">{message}</span>
                <Badge variant="default">Connected</Badge>
              </>
            )}
            {status === 'error' && (
              <>
                <XCircle className="h-5 w-5 text-destructive" />
                <span className="text-destructive">{message}</span>
                <Badge variant="destructive">Error</Badge>
              </>
            )}
          </div>

          <div className="mt-4 p-4 bg-muted rounded-md">
            <h3 className="font-medium mb-2">Configuration Details:</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? '✓ Configured' : '✗ Missing'}</li>
              <li>Anon Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ Configured' : '✗ Missing'}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
