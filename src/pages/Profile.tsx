
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

const Profile = () => {
  const { user, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nip: '',
    position: '',
    department: '',
    join_date: '',
    phone: ''
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
    
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        nip: user.nip || '',
        position: user.position || '',
        department: user.department || '',
        join_date: user.join_date || '',
        phone: user.phone || ''
      });
    }
  }, [user, loading, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Profil telah diperbarui",
        description: "Perubahan profil Anda telah berhasil disimpan.",
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan profil",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container max-w-3xl mx-auto flex justify-center items-center min-h-[50vh]">
          <p>Memuat...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-lumbang-dark mb-6">Profil Saya</h1>
        
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Informasi Pribadi</CardTitle>
                <CardDescription>Kelola informasi pribadi Anda</CardDescription>
              </div>
              {!isEditing ? (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleSave} className="bg-lumbang-primary hover:bg-lumbang-accent">
                    Simpan
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-lumbang-light border-4 border-lumbang-primary flex items-center justify-center">
                  <User className="h-12 w-12 text-lumbang-primary" />
                </div>
                {isEditing && (
                  <Button size="sm" className="absolute bottom-0 right-0 rounded-full bg-lumbang-primary hover:bg-lumbang-accent w-8 h-8 p-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </Button>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  {isEditing ? (
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                  ) : (
                    <p className="p-2 border rounded-md bg-gray-50">{formData.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input id="email" name="email" value={formData.email} onChange={handleInputChange} />
                  ) : (
                    <p className="p-2 border rounded-md bg-gray-50">{formData.email}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nip">NIP</Label>
                  <p className="p-2 border rounded-md bg-gray-50">{formData.nip}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">No. Telepon</Label>
                  {isEditing ? (
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
                  ) : (
                    <p className="p-2 border rounded-md bg-gray-50">{formData.phone}</p>
                  )}
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">Jabatan</Label>
                  <p className="p-2 border rounded-md bg-gray-50">{formData.position}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Departemen</Label>
                  <p className="p-2 border rounded-md bg-gray-50">{formData.department}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="join_date">Tanggal Bergabung</Label>
                <p className="p-2 border rounded-md bg-gray-50">{formData.join_date}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Keamanan</CardTitle>
            <CardDescription>Kelola pengaturan keamanan akun Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <div className="flex items-center justify-between">
                <p className="text-sm">********</p>
                <Button variant="outline" size="sm">Ubah Kata Sandi</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
