import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Home, Shield, User, Lock, Mail } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (type: 'student' | 'admin') => {
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const success = login(email, password, type);
    
    if (success) {
      toast({
        title: "Welcome back!",
        description: `Successfully logged in as ${type}`,
      });
      navigate(type === 'admin' ? '/admin' : '/dashboard');
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 gradient-warm opacity-50" />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-4 gradient-primary rounded-2xl flex items-center justify-center shadow-lg"
          >
            <Home className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground">Smart Hostel</h1>
          <p className="text-muted-foreground mt-2">Room Attendance System</p>
        </div>

        <Card className="glass border-0 shadow-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to mark your attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="student" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="student" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Student
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Admin
                </TabsTrigger>
              </TabsList>
              
              <AnimatePresence mode="wait">
                <TabsContent value="student" key="student">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="student-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="student-email"
                          type="email"
                          placeholder="your.email@college.edu"
                          className="pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="student-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="student-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button
                      className="w-full gradient-primary hover:opacity-90 transition-opacity"
                      onClick={() => handleLogin('student')}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Signing in...' : 'Sign in as Student'}
                    </Button>
                    
                    <div className="text-center text-sm text-muted-foreground mt-4 p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium mb-1">Demo Credentials:</p>
                      <p>Email: priya.sharma@college.edu</p>
                      <p>Password: student123</p>
                    </div>
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="admin" key="admin">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="admin-email"
                          type="email"
                          placeholder="admin@college.edu"
                          className="pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="admin-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button
                      className="w-full bg-foreground text-background hover:bg-foreground/90 transition-opacity"
                      onClick={() => handleLogin('admin')}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Signing in...' : 'Sign in as Admin'}
                    </Button>
                    
                    <div className="text-center text-sm text-muted-foreground mt-4 p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium mb-1">Demo Credentials:</p>
                      <p>Email: admin@college.edu</p>
                      <p>Password: admin123</p>
                    </div>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </CardContent>
        </Card>
        
        <p className="text-center text-sm text-muted-foreground mt-6">
          Secure • AI-Powered • Location Verified
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
