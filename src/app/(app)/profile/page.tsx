"use client"
import React, { useState } from 'react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Mail, Phone, MapPin, Shield, Key, Edit } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';

interface UserData {
    displayName: string;
    email: string;
    phoneNumber: string;
    address: string;
}

const ProfilePage: React.FC = () => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [formData, setFormData] = useState<UserData>({
        displayName: "John Doe",
        email: "john@example.com",
        phoneNumber: "+91 9876543210",
        address: "123 Financial District, Mumbai"
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsDialogOpen(false);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow">
                <div className="max-w-5xl mx-auto p-4">
                    {showAlert && (
                        <Alert className="mb-4 bg-green-50 dark:bg-green-900">
                            <AlertDescription>
                                Profile updated successfully!
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="mb-4">
                        <h2 className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                            <Link href="/" className="hover:underline">Home</Link> &gt; Profile
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {/* Profile Overview Card */}
                        <Card className="bg-white dark:bg-[#1c1d1f]">
                            <CardHeader className="text-center pb-4">
                                <div className="flex justify-end mb-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsDialogOpen(true)}
                                        className="absolute"
                                    >
                                        <Edit className="h-5 w-5" />
                                    </Button>
                                </div>
                                <div className="relative w-32 h-32 mx-auto mb-4">
                                    <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                        <span className="text-4xl text-gray-500">{formData.displayName[0]}</span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="absolute bottom-0 right-0 rounded-full"
                                    >
                                        <Camera className="h-4 w-4" />
                                    </Button>
                                </div>
                                <CardTitle className="text-xl font-semibold">{formData.displayName}</CardTitle>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Member since 2024</p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 pt-4 border-t">
                                    <div className="flex items-center space-x-3">
                                        <Mail className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm">{formData.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Phone className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm">{formData.phoneNumber}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <MapPin className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm">{formData.address}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Edit Profile Dialog */}
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Edit Profile</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="displayName">Display Name</Label>
                                            <Input
                                                id="displayName"
                                                name="displayName"
                                                value={formData.displayName}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                disabled={true}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phoneNumber">Phone Number</Label>
                                            <Input
                                                id="phoneNumber"
                                                name="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="address">Address</Label>
                                            <Input
                                                id="address"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                            />
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
                                        <Button
                                            type="submit"
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            Save Changes
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>

                        {/* Security Card */}
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
                                                <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                                            </div>
                                        </div>
                                        <Button variant="outline">Change</Button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <Shield className="h-5 w-5 text-gray-500" />
                                            <div>
                                                <h3 className="font-medium">Two-Factor Authentication</h3>
                                                <p className="text-sm text-gray-500">Not enabled</p>
                                            </div>
                                        </div>
                                        <Button variant="outline">Enable</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProfilePage;