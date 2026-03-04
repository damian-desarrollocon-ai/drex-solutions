import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Ticket, Loader2, Copy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient.js';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const ReferralCodeGenerator = ({ user }) => {
  const { user: adminUser } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  const generateCode = async () => {
    setLoading(true);
    setGeneratedCode('');
    
    const code = `DREX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const { data, error } = await supabase
      .from('referral_codes')
      .insert({
        code: code,
        generated_by_admin_id: adminUser.id,
        // assigned_to_user_id: user.id, // This is now assigned on registration
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error al generar código",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setGeneratedCode(data.code);
      toast({
        title: "Código generado",
        description: `Se ha generado un nuevo código de invitación.`,
      });
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({ title: "Copiado", description: "Código copiado al portapapeles." });
  };
  
  const handleOpenChange = (open) => {
    if(!open) {
      setGeneratedCode('');
    }
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-purple-500">
          <Ticket className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generar Código de Invitación</DialogTitle>
          <DialogDescription>
            Genera un código de un solo uso para que un nuevo usuario pueda registrarse.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <Button onClick={generateCode} disabled={loading} className="w-full">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generando...</> : "Generar Nuevo Código"}
          </Button>
          {generatedCode && (
            <div className="space-y-2">
              <Label>Código Generado:</Label>
              <div className="flex items-center space-x-2">
                <Input value={generatedCode} readOnly />
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReferralCodeGenerator;