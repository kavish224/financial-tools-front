"use client"
import { Ad } from '@/components/Ad';
import { AdvanceDecline } from '@/components/AdvanceDecline';
import { FiiDii } from '@/components/FiiDii';
import { Footer } from '@/components/Footer';
import { GainersLosers } from '@/components/GainersLosers';
import { Graph } from '@/components/Graph';
import { Headlines } from '@/components/Headlines';
import { Indices } from '@/components/Indices';
import { Navbar } from '@/components/Navbar';
import { SectorCards } from '@/components/SectorCards';
import { useAuth } from "@/components/AuthProvider"; // Adjust the path as needed
import MarketDashboard from '@/components/Sectors';
import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
function Page() {
    const { user, loading } = useAuth();

    // useEffect(() => {
    //     if (!loading && !user) {
            
    //     }
    // }, [loading, user, router]);

    if (loading) {
        return (<div>Loading...</div>); // Loading spinner while checking auth state
    }

    if (!user) {
        return (
            <div>
                <div>Please login to view the market page</div>
                <Button>
                    <Link href="/login">Login</Link>
                </Button>
            </div>
        );
    }
    return (
        <div>
            <Navbar />
            <div className="grid grid-cols-12 bg-[#000] dark:bg-[#000]">
                <section className="col-span-3 pl-2 pt-2"><Indices /></section>
                <section className="col-span-3 pl-2 pt-2"><Graph /></section>
                <section className="col-span-2 pl-2 pt-2"><FiiDii /></section>
                <section className="col-span-4 m-2 ml-7"><Ad /></section>

                <section className="col-span-12 h-800px pr-2 pl-2 pb-2"><SectorCards /></section>

                <section className="col-span-9 pl-2 pr-2"><MarketDashboard /></section>
                <section className="col-span-3 pr-2"><Headlines /></section>

                <section className="col-span-12 pl-2 pt-2 pr-2"><Ad /></section>
                <section className="col-span-6 pl-2 pt-2 pr-2 pb-2"><GainersLosers /></section>
                <section className="col-span-2 pt-2 pr-2"><AdvanceDecline /></section>
                <section className="col-span-4 pt-2 pr-2"><Ad /></section>
                {/* <section className="col-span-3 pl-2 pt-2 pr-2"><Ad /></section> */}
            </div>
            <Footer />
        </div>
    )
}
export default Page;