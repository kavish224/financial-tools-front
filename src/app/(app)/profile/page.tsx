'use client';
import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Mail, Shield, Key, Edit, BadgeCheck } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/components/AuthProvider';
import { getCurrentUserProfile, updateUserProfile } from '@/lib/auth';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserData {
    displayName: string;
    email: string;
    emailVerified: boolean;
    photoURL: string;
    createdAt: string;
    lastLoginAt: string;
}

const ProfilePage: React.FC = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const { register, handleSubmit, reset } = useForm<UserData>();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userProfile = await getCurrentUserProfile();
                if (userProfile) {
                    reset({
                        displayName: userProfile.displayName || '',
                        email: userProfile.email || '',
                        photoURL: userProfile.photoURL || '',
                        emailVerified: userProfile.emailVerified,
                        createdAt: userProfile.createdAt || '',
                        lastLoginAt: userProfile.lastLoginAt || '',
                    });
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
            }
        };
        fetchUserProfile();
    }, [reset]);

    const onSubmit: SubmitHandler<UserData> = async (data) => {
        if (!auth.currentUser) return;

        try {
            await updateUserProfile({
                displayName: data.displayName,
                photoURL: data.photoURL,
            });

            setShowAlert(true);
            setError(null);
            setIsDialogOpen(false);

            setTimeout(() => setShowAlert(false), 3000);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile. Please try again.');
        }
    };

    return (
        <ProtectedRoute>
            <div className="flex flex-col">
                <Navbar />
                <main className="flex-grow min-h-screen">
                    <div className="max-w-5xl mx-auto p-4">
                        {showAlert && (
                            <Alert className="mb-4 bg-green-50 dark:bg-green-900">
                                <AlertDescription>Profile updated successfully!</AlertDescription>
                            </Alert>
                        )}
                        {error && (
                            <Alert className="mb-4 bg-red-50 dark:bg-red-900">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <div className="mb-4">
                            <h2 className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                                <Link href="/" className="hover:underline">Home</Link> &gt; Profile
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <Card className="bg-white dark:bg-[#1c1d1f]">
                                <CardHeader className="text-center pb-4">
                                    <div className="flex justify-end mb-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setIsDialogOpen(true)}
                                            className="absolute"
                                            aria-label="Edit Profile"
                                        >
                                            <Edit className="h-5 w-5" />
                                        </Button>
                                    </div>
                                    <div className="relative w-32 h-32 mx-auto mb-4">
                                        <Avatar className="cursor-pointer w-full h-full">
                                            <AvatarImage
                                                src={user?.photoURL || "https://github.com/k.png"}
                                                alt="user avatar"
                                                referrerPolicy="no-referrer"
                                            />
                                            <AvatarFallback>
                                                {user?.displayName?.charAt(0) || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="absolute bottom-0 right-0 rounded-full"
                                        >
                                            <Camera className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <CardTitle className="text-xl font-semibold">{user?.displayName}</CardTitle>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.metadata?.creationTime}</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4 pt-4 border-t">
                                        <div className="flex items-center space-x-3">
                                            <Mail className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm">{user?.email}</span>
                                            <span>
                                                {user?.emailVerified ? (
                                                    <BadgeCheck className="text-green-500 h-4 w-4" />
                                                ) : (
                                                    <span className="text-xs text-red-500">Not verified</span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogContent className="sm:max-w-[500px]">
                                    <DialogHeader>
                                        <DialogTitle>Edit Profile</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="displayName">Display Name</Label>
                                                <Input id="displayName" {...register("displayName")} />
                                            </div>
                                        </div>
                                        <div className="flex justify-end space-x-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setIsDialogOpen(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button type="submit">
                                                Save Changes
                                            </Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                            <Card className="bg-white dark:bg-[#1c1d1f]">
                                <CardHeader className="pb-6">
                                    <div className="flex items-center space-x-2">
                                        <Shield className="h-5 w-5 text-gray-500" />
                                        <CardTitle className="text-xl font-semibold">Security Settings</CardTitle>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Manage your account security and authentication methods
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <Key className="h-5 w-5 text-gray-500" />
                                                <div>
                                                    <h3 className="font-medium">Password</h3>
                                                </div>
                                            </div>
                                            <Link href="/change-password">
                                                <Button>Change</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </ProtectedRoute>
    );
};

export default ProfilePage;