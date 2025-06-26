"use client";
import  Ad from "@/components/Ad";
import { AdvanceDecline } from "@/components/AdvanceDecline";
import { FiiDii } from "@/components/FiiDii";
import { Footer } from "@/components/Footer";
import { GainersLosers } from "@/components/GainersLosers";
import { Graph } from "@/components/Graph";
import { Headlines } from "@/components/Headlines";
import { Indices } from "@/components/Indices";
import { Navbar } from "@/components/Navbar";
import { SectorCards } from "@/components/SectorCards";
import MarketDashboard from "@/components/Sectors";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

function Page() {
  // return (
  // //   <div className="flex flex-col items-center justify-center h-screen">
  // //     <div className="text-lg mb-4">Wrong Address</div>
  // //     <div className="text-lg mb-4">Back to home</div>
  // //     <Button>
  // //       <Link href="/">Home</Link>
  // //     </Button>
  // //   </div>
  // // );
  return (
    <ProtectedRoute>
      <div>
        <Navbar />
        <div className="grid grid-cols-12 gap-4 p-4">
          {/* Indices Section */}
          <section className="col-span-12 sm:col-span-6 lg:col-span-3">
            <Indices />
          </section>

          {/* Graph Section */}
          <section className="col-span-12 sm:col-span-6 lg:col-span-3">
            <Graph />
          </section>

          {/* FII/DII Section */}
          <section className="col-span-12 sm:col-span-6 lg:col-span-2">
            <FiiDii />
          </section>

          {/* Advertisement */}
          <section className="col-span-12 lg:col-span-4">
            <Ad />
          </section>

          {/* Sector Cards */}
          <section className="col-span-12">
            <SectorCards />
          </section>

          {/* Market Dashboard and Headlines */}
          <section className="col-span-12 lg:col-span-9" key={"5"}>
            <MarketDashboard />
          </section>
          <section className="col-span-12 lg:col-span-3">
            <Headlines />
          </section>

          {/* Additional Ads and Sections */}
          <section className="col-span-12">
            <Ad />
          </section>
          <section className="col-span-12 md:col-span-6">
            <GainersLosers />
          </section>
          <section className="col-span-12 md:col-span-3">
            <AdvanceDecline />
          </section>
          <section className="col-span-12 md:col-span-3">
            <Ad />
          </section>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );

}

export default Page;
