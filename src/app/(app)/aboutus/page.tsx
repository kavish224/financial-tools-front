"use client"

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

function AboutUsPage() {
    return (
        <div>
            <Navbar />
            <div className="min-h-screen p-4">
                <div className="flex flex-col justify-center items-center pt-16 px-4">
                    <h1 className="text-4xl mb-6 text-center md:text-4xl lg:text-5xl">
                        About Us
                    </h1>
                    <p className="text-lg max-w-3xl text-center mb-4">
                        Welcome to {"k"}, your ultimate tool for intelligent stock market analysis.
                        We are dedicated to providing traders with the insights they need to make smarter, more confident investment decisions.
                    </p>
                    <p className="text-lg max-w-3xl text-center mb-4">
                        Our platform empowers you with real-time market scans, historical data, and personalized insights. 
                        With a focus on simplicity and accessibility, we help you track and analyze Nifty 500 stocks, providing the data you need to make informed decisions.
                    </p>
                    <p className="text-lg max-w-3xl text-center mb-6">
                        Whether you're a seasoned investor or just getting started, we offer tools to help you navigate the stock market with confidence. 
                        Let us help you achieve your financial goals by providing the tools and resources necessary to make better investment decisions.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default AboutUsPage;
