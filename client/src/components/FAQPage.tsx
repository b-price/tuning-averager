import React, { useState } from 'react';
import { FAQS } from "../defaults.ts";

const FAQPage: React.FC = () => {
    const [visibleIndex, setVisibleIndex] = useState<number | null>(null);

    const toggleAnswerVisibility = (index: number) => {
        setVisibleIndex(visibleIndex === index ? null : index);
    };

    return (
        <div className="flex flex-col p-6 sm:max-w-xl">
            <div className="flex items-center mb-4 gap-4">
                <h1 className="text-2xl font-bold text-left">FAQs</h1>
            </div>
            <div className="flex flex-wrap gap-10">
                <div className="mb-7 text-left w-full">
                    {FAQS.map((faq, index) => (
                        <div key={index} className="mb-4">
                            <button
                                onClick={() => toggleAnswerVisibility(index)}
                                className="block sm:text-xl text-lg font-semibold text-left w-full"
                            >
                                {faq.question}
                            </button>
                            <div
                                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                    visibleIndex === index ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                                }`}
                            >
                                <p className="mt-1 mx-2 sm:text-lg">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQPage;

