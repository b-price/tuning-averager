import React from "react";
import {Link} from "react-router-dom";
import {EXTERNAL_URLS} from "../defaults.ts";

const Footer: React.FC = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="w-full p-8">
            <div
                className="flex flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 text-center md:justify-between">
                {/*<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">*/}
                {/*    <path*/}
                {/*        d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z"/>*/}
                {/*    <path*/}
                {/*        d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z"/>*/}
                {/*    <path*/}
                {/*        d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z"/>*/}
                {/*</svg>*/}

                <svg version="1.0" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20"
                     viewBox="0 0 900.000000 900.000000" preserveAspectRatio="xMidYMid meet">
                    <g transform="translate(0.000000,900.000000) scale(0.100000,-0.100000)" fill="currentColor"
                       stroke="none">
                        <path
                            d="M1830 8975 c0 -18 -10 -31 -33 -45 -19 -11 -39 -31 -45 -44 -6 -13 -25 -32 -42 -42 -17 -11 -33 -28 -36 -39 -3 -11 -23 -30 -44 -43 -22 -12 -40 -27 -40 -32 0 -9 -78 -89 -134 -137 -14 -13 -26 -29 -26 -36 0 -7 -16 -21 -36 -32 -19 -10 -42 -32 -50 -47 -8 -15 -18 -28 -23 -28 -11 0 -131 -117 -131 -128 0 -5 -18 -22 -40 -37 -22 -15 -42 -35 -45 -45 -3 -10 -23 -29 -45 -43 -21 -15 -41 -36 -45 -47 -4 -12 -18 -25 -32 -31 -14 -5 -27 -18 -30 -28 -3 -10 -25 -33 -49 -51 -24 -17 -44 -37 -44 -45 0 -7 -16 -22 -35 -34 -20 -11 -44 -34 -53 -51 -9 -16 -25 -33 -34 -36 -9 -3 -20 -14 -23 -24 -4 -11 -26 -34 -51 -50 -24 -17 -44 -39 -44 -48 0 -10 -16 -26 -36 -37 -19 -10 -42 -31 -50 -46 -7 -15 -22 -30 -32 -33 -11 -4 -24 -17 -30 -31 -6 -13 -29 -36 -52 -50 -22 -14 -40 -31 -40 -39 0 -7 -17 -25 -39 -40 -21 -15 -43 -38 -49 -51 -7 -14 -16 -25 -21 -25 -13 0 -131 -116 -131 -129 0 -5 -16 -19 -35 -31 -20 -12 -42 -35 -50 -50 -8 -16 -24 -31 -35 -35 -17 -5 -20 -15 -20 -66 0 -44 4 -61 15 -65 23 -9 45 15 45 47 0 27 3 29 39 29 44 0 54 13 44 61 -6 30 -5 31 24 25 38 -9 63 13 63 55 0 26 3 29 25 23 37 -9 57 11 49 52 -6 33 -6 34 23 28 40 -8 66 18 58 57 -7 33 2 36 52 18 23 -8 32 -18 35 -41 5 -33 -13 -48 -36 -29 -11 10 -18 7 -30 -11 -9 -12 -16 -29 -16 -38 0 -8 -15 -22 -33 -30 -23 -11 -33 -23 -37 -45 -4 -24 -11 -31 -35 -33 -41 -5 -55 -19 -55 -53 0 -26 -3 -29 -28 -27 -40 3 -52 -8 -52 -48 0 -31 -3 -34 -29 -34 -33 0 -44 -11 -45 -49 -1 -23 -6 -26 -38 -29 l-38 -3 0 -126 c0 -125 0 -126 20 -108 11 10 20 26 20 36 0 12 13 24 35 33 19 8 40 26 46 39 6 13 25 30 42 38 37 16 46 45 20 64 -15 11 -16 14 -3 19 8 3 28 5 44 3 24 -2 34 4 50 30 12 18 33 36 49 42 22 8 27 16 27 45 0 33 3 36 28 36 35 0 48 9 61 42 6 17 24 33 45 42 22 9 38 24 41 38 4 14 18 29 34 35 16 6 34 24 42 42 8 20 27 38 46 46 20 9 33 22 35 37 2 15 16 29 41 41 22 10 37 24 37 35 0 23 19 42 41 42 10 0 27 16 39 36 13 19 33 40 46 45 14 5 29 20 34 34 5 14 26 35 45 46 19 12 38 32 41 45 3 13 12 24 19 24 7 0 31 20 53 45 22 25 45 45 51 45 6 0 21 15 32 34 11 19 36 44 55 55 19 11 34 27 34 35 0 9 13 22 30 31 16 8 37 29 45 46 9 17 29 35 46 41 16 5 29 15 29 21 1 16 30 49 63 70 15 9 27 24 27 31 0 8 16 24 36 35 20 12 41 35 47 51 6 17 20 30 32 32 11 2 27 18 37 38 11 21 30 40 49 48 17 7 33 22 36 32 3 11 20 28 38 39 19 11 41 33 50 50 8 17 22 31 30 31 8 0 25 16 39 36 13 20 38 45 55 55 17 10 31 25 31 32 0 8 17 26 39 41 21 15 43 38 49 51 7 14 17 25 23 25 10 0 133 120 141 138 1 4 18 18 36 31 58 40 44 51 -67 51 -90 0 -99 -2 -104 -20 -3 -13 -14 -20 -30 -20 -28 0 -57 -32 -57 -62 0 -12 -8 -18 -23 -18 -25 0 -57 -28 -57 -48 0 -7 -15 -22 -34 -34 -21 -14 -37 -34 -40 -50 -4 -22 -11 -28 -30 -28 -31 0 -56 -24 -56 -54 0 -16 -8 -24 -32 -31 -22 -7 -38 -20 -48 -42 -9 -19 -27 -37 -43 -42 -19 -7 -29 -19 -33 -41 -5 -23 -12 -30 -29 -30 -27 0 -52 -26 -57 -59 -2 -18 -12 -27 -36 -33 -24 -6 -36 -17 -43 -38 -7 -17 -21 -32 -39 -38 -20 -7 -30 -19 -35 -41 -5 -24 -12 -31 -29 -31 -28 0 -53 -26 -58 -60 -2 -19 -10 -26 -30 -28 -30 -4 -58 -35 -58 -64 0 -13 -8 -18 -26 -18 -19 0 -28 -8 -39 -34 -9 -20 -23 -36 -38 -40 -22 -5 -37 -26 -51 -68 -3 -11 -15 -18 -29 -18 -29 0 -57 -29 -57 -58 0 -18 -6 -22 -30 -22 -26 0 -31 -5 -40 -40 -6 -22 -15 -38 -20 -35 -4 3 -20 1 -33 -4 -19 -8 -26 -18 -29 -43 -3 -28 -7 -33 -33 -36 -41 -5 -57 -20 -53 -51 3 -23 0 -26 -27 -25 -35 1 -54 -20 -55 -58 0 -19 -4 -26 -13 -22 -21 7 -61 -31 -62 -57 0 -18 -6 -25 -25 -26 -32 -4 -55 15 -64 51 -7 28 -6 28 23 23 35 -7 56 13 56 52 0 23 4 26 30 23 38 -4 76 31 57 50 -23 23 -14 41 18 35 40 -8 64 16 56 56 -6 29 -5 29 28 23 42 -8 61 11 53 57 -5 32 -5 32 32 29 42 -4 73 20 53 40 -24 24 -13 38 27 38 41 0 51 11 51 55 0 28 11 37 30 25 21 -13 50 17 50 52 0 24 4 28 29 28 36 0 54 21 45 54 -6 25 -4 26 34 26 43 0 52 10 52 61 0 29 22 41 35 18 12 -18 45 21 45 53 0 22 5 28 21 28 37 0 60 19 57 48 -3 23 1 27 27 30 42 5 57 20 53 56 -3 28 0 31 28 32 43 1 54 10 54 45 0 24 4 29 23 29 33 0 62 23 54 44 -11 27 2 43 29 38 34 -6 54 14 54 55 0 32 2 35 23 29 33 -8 67 19 67 53 0 25 3 28 25 23 36 -6 57 15 50 50 -6 26 -4 28 23 28 35 0 49 14 54 55 2 24 8 30 29 31 33 1 49 11 49 30 0 11 -17 14 -80 14 -79 0 -80 0 -80 -25z"/>
                        <path
                            d="M4670 8987 c0 -11 -126 -153 -170 -192 -11 -10 -44 -44 -221 -226 -47 -49 -90 -89 -95 -90 -5 0 -31 -27 -59 -60 -27 -32 -58 -67 -69 -76 -10 -10 -132 -133 -271 -273 -139 -140 -260 -262 -269 -270 -9 -8 -44 -44 -79 -79 -34 -35 -480 -484 -992 -997 -511 -513 -968 -972 -1015 -1021 -47 -48 -114 -115 -150 -148 -71 -65 -330 -337 -343 -361 -4 -8 -12 -14 -16 -14 -8 0 -250 -242 -715 -715 -203 -207 -206 -211 -206 -252 0 -24 5 -43 10 -43 6 0 10 11 10 24 0 18 6 25 23 28 14 2 23 11 25 24 2 12 12 24 23 27 10 3 19 12 19 21 0 9 11 18 25 22 16 4 25 13 25 25 0 12 10 23 25 29 14 5 25 16 25 25 0 9 11 20 25 25 14 5 25 16 25 25 0 8 11 17 25 21 15 4 25 13 25 24 0 10 9 21 19 25 10 3 22 17 25 31 5 19 11 24 26 19 16 -5 20 -2 20 15 0 14 9 24 30 32 23 7 29 15 25 28 -4 13 1 19 18 24 14 3 27 15 30 26 3 12 13 20 26 20 14 0 21 6 21 20 0 13 10 24 25 30 15 6 25 17 25 30 0 13 7 20 20 20 13 0 24 10 30 25 6 15 17 25 30 25 13 0 20 7 20 20 0 13 10 24 25 30 15 6 25 17 25 30 0 13 7 20 19 20 11 0 22 8 26 18 3 11 16 24 30 30 16 7 23 17 19 26 -4 10 2 17 19 21 16 4 28 16 32 32 4 17 11 23 21 19 10 -4 18 3 24 20 6 14 19 28 30 31 11 3 20 14 20 24 0 12 7 19 20 19 13 0 24 10 30 26 7 18 16 24 32 22 20 -3 23 1 20 24 -2 21 2 27 20 30 14 2 24 12 28 28 4 16 12 24 23 22 11 -2 19 6 23 23 4 17 13 25 29 25 18 0 21 4 18 24 -4 19 0 25 18 28 15 2 25 12 29 28 3 14 15 27 25 29 11 2 26 12 33 22 7 11 19 19 27 19 7 0 15 10 17 23 2 14 11 23 25 25 14 2 23 11 25 25 2 14 11 23 25 25 13 2 24 13 27 28 4 15 14 24 26 24 15 0 19 6 17 22 -1 17 4 24 21 26 13 2 27 14 32 28 5 13 16 24 24 24 8 0 17 9 21 19 3 10 15 21 25 24 12 3 20 14 20 26 0 12 5 22 10 22 6 1 16 2 23 3 6 0 16 11 22 23 5 12 17 24 27 26 10 3 18 14 18 25 0 13 9 22 25 26 16 4 25 13 25 26 0 11 5 21 10 21 6 1 13 2 18 3 15 3 66 61 67 76 0 9 11 16 28 18 21 3 27 9 27 28 0 18 5 24 21 24 12 0 23 8 26 20 3 10 13 22 23 25 11 3 20 16 22 28 2 14 11 23 26 25 13 2 27 14 32 28 5 13 16 24 25 24 8 0 15 7 15 15 0 9 11 20 24 25 14 5 26 19 28 32 2 15 11 24 25 26 13 2 23 7 23 11 0 5 11 20 25 35 14 15 25 31 25 36 0 5 10 10 22 12 15 2 24 11 26 25 2 14 12 25 27 29 13 3 25 14 28 25 3 10 12 19 20 19 9 0 17 10 19 23 2 14 11 23 26 25 13 2 26 11 29 20 8 20 70 82 83 82 5 0 10 10 12 23 2 14 11 23 26 25 13 2 26 11 29 20 10 25 45 62 70 72 12 5 23 19 25 32 2 17 9 22 26 21 13 -2 22 3 22 10 0 17 60 82 83 90 9 4 17 16 17 27 0 12 9 24 24 29 13 5 26 17 29 25 4 9 13 16 21 16 8 0 16 10 18 22 2 14 12 24 28 28 16 4 26 14 28 28 2 12 7 22 11 22 12 0 81 67 81 79 0 6 11 16 25 21 14 5 25 14 25 21 0 16 53 66 75 70 11 2 22 15 25 29 4 16 14 26 28 28 12 2 22 10 22 18 0 8 7 17 16 21 8 3 19 16 24 29 5 12 19 24 32 26 13 2 24 11 26 22 5 23 49 69 75 79 9 3 17 15 17 26 0 13 8 21 23 23 14 2 23 11 25 26 2 12 10 22 17 22 8 0 22 11 31 25 9 14 22 25 29 25 8 0 17 9 20 21 4 11 18 24 31 29 14 6 24 18 24 30 0 11 7 20 15 20 8 0 19 9 25 19 5 11 19 23 30 26 11 3 20 15 20 26 0 12 10 23 25 29 16 6 25 17 25 30 0 12 6 20 13 19 27 -3 37 2 37 21 0 13 9 22 25 26 15 4 25 13 25 23 0 10 11 23 25 29 14 7 28 19 31 27 4 8 12 15 20 15 7 0 16 11 20 25 4 16 13 25 25 25 11 0 22 8 26 18 3 9 28 38 54 64 27 26 49 52 49 57 0 5 9 13 20 16 11 3 20 13 20 22 0 8 8 17 19 20 10 2 24 16 30 29 7 16 19 24 36 24 22 0 25 4 20 20 -4 14 -1 22 12 27 23 9 78 63 86 86 4 9 16 17 27 17 13 0 20 7 20 20 0 13 10 24 25 30 15 6 25 17 25 30 0 13 7 20 18 20 11 0 24 11 30 25 6 14 18 25 26 25 8 0 17 9 21 19 3 11 15 23 25 26 10 3 22 15 25 26 4 10 15 19 25 19 18 0 30 19 30 46 0 10 -13 14 -45 14 -31 0 -45 -4 -45 -13z"/>
                        <path
                            d="M4827 8972 c-4 -17 -16 -33 -31 -40 -14 -6 -26 -16 -26 -21 0 -13 -52 -66 -73 -74 -9 -4 -20 -15 -24 -24 -9 -23 -58 -73 -72 -73 -7 0 -16 -11 -21 -24 -5 -13 -18 -27 -29 -31 -12 -3 -21 -11 -21 -17 0 -14 -65 -78 -79 -78 -5 0 -13 -9 -16 -21 -4 -11 -18 -24 -31 -29 -13 -5 -24 -14 -24 -20 0 -14 -217 -230 -230 -230 -6 0 -10 -5 -10 -11 0 -13 -128 -139 -141 -139 -5 0 -9 -5 -9 -11 0 -6 -45 -55 -100 -109 -55 -54 -100 -103 -100 -109 0 -6 -7 -11 -15 -11 -8 0 -19 -9 -25 -20 -14 -26 -78 -90 -90 -90 -6 0 -10 -4 -10 -8 0 -12 -118 -132 -129 -132 -5 0 -12 -9 -16 -19 -3 -11 -15 -23 -25 -26 -10 -3 -22 -15 -25 -25 -3 -10 -15 -22 -25 -25 -11 -4 -23 -17 -26 -31 -4 -15 -13 -24 -25 -24 -10 0 -19 -7 -19 -15 0 -9 -11 -21 -25 -27 -14 -6 -25 -16 -25 -21 0 -6 -34 -43 -75 -82 -41 -40 -75 -77 -75 -83 0 -7 -5 -12 -11 -12 -14 0 -139 -125 -139 -139 0 -6 -4 -11 -10 -11 -13 0 -125 -112 -133 -134 -5 -12 -14 -17 -27 -13 -14 4 -20 0 -20 -12 0 -10 -11 -27 -25 -39 -14 -12 -25 -27 -25 -32 0 -6 -11 -15 -25 -20 -14 -5 -25 -16 -25 -25 0 -9 -11 -20 -25 -25 -14 -5 -25 -16 -25 -24 0 -8 -9 -17 -19 -21 -10 -3 -21 -15 -24 -26 -3 -11 -14 -23 -25 -26 -11 -2 -34 -25 -53 -49 -18 -24 -39 -44 -46 -44 -7 0 -18 -11 -23 -24 -5 -13 -18 -27 -29 -31 -11 -3 -23 -15 -26 -26 -4 -10 -12 -19 -20 -19 -8 0 -17 -9 -20 -21 -4 -11 -18 -24 -31 -29 -13 -5 -24 -15 -24 -21 0 -12 -69 -79 -81 -79 -4 0 -9 -10 -11 -22 -2 -15 -11 -24 -27 -26 -13 -2 -26 -12 -28 -23 -3 -10 -9 -19 -14 -19 -5 0 -14 -11 -20 -24 -7 -14 -22 -27 -35 -30 -15 -4 -24 -14 -24 -26 0 -13 -9 -22 -25 -26 -13 -3 -27 -15 -30 -25 -4 -10 -13 -19 -21 -19 -8 0 -14 -9 -14 -21 0 -13 -10 -23 -30 -30 -19 -7 -30 -18 -30 -30 0 -11 -7 -22 -15 -25 -22 -9 -70 -56 -78 -76 -3 -9 -16 -18 -29 -20 -15 -2 -24 -11 -26 -25 -2 -13 -7 -23 -11 -23 -12 0 -77 -64 -84 -82 -3 -10 -16 -18 -27 -18 -14 0 -20 -7 -20 -21 0 -12 -8 -23 -18 -26 -10 -2 -22 -14 -27 -26 -6 -12 -20 -23 -32 -25 -15 -2 -23 -10 -23 -23 0 -12 -10 -23 -25 -29 -14 -5 -25 -16 -25 -24 0 -8 -9 -17 -19 -21 -10 -3 -21 -15 -24 -26 -3 -11 -14 -23 -25 -26 -11 -3 -22 -14 -25 -25 -3 -11 -15 -22 -26 -25 -11 -3 -23 -14 -26 -24 -4 -10 -13 -19 -21 -19 -8 0 -19 -11 -24 -24 -5 -13 -18 -27 -29 -31 -12 -3 -21 -13 -21 -21 0 -8 -11 -19 -24 -25 -13 -6 -27 -20 -29 -30 -3 -11 -14 -19 -26 -19 -16 0 -21 -6 -21 -25 0 -20 -5 -25 -25 -25 -20 0 -25 -5 -25 -25 0 -15 -6 -25 -14 -25 -7 0 -21 -11 -30 -25 -9 -14 -25 -25 -36 -25 -11 0 -20 -7 -20 -15 0 -17 -64 -85 -80 -85 -5 0 -10 -9 -10 -20 0 -13 -9 -22 -25 -26 -14 -3 -25 -12 -25 -20 0 -7 -11 -21 -25 -30 -14 -9 -25 -23 -25 -30 0 -8 -7 -14 -15 -14 -8 0 -22 -11 -31 -25 -9 -13 -24 -27 -35 -30 -10 -4 -19 -15 -19 -25 0 -10 -9 -21 -19 -25 -11 -3 -23 -15 -26 -26 -4 -10 -15 -19 -25 -19 -10 0 -20 -10 -24 -24 -3 -13 -15 -26 -27 -29 -11 -3 -23 -15 -26 -26 -3 -12 -12 -21 -19 -21 -8 0 -19 -11 -24 -25 -5 -14 -16 -25 -25 -25 -9 0 -20 -11 -25 -25 -5 -14 -16 -25 -25 -25 -9 0 -20 -11 -24 -24 -5 -13 -19 -26 -30 -29 -12 -3 -21 -12 -21 -21 0 -9 -11 -18 -25 -22 -16 -4 -25 -13 -25 -26 0 -11 -8 -22 -20 -25 -11 -3 -23 -16 -26 -29 -4 -15 -13 -24 -26 -24 -11 0 -22 -8 -25 -20 -3 -10 -13 -22 -23 -25 -10 -3 -20 -15 -23 -26 -3 -11 -15 -23 -26 -26 -12 -3 -21 -12 -21 -19 0 -8 -11 -19 -25 -24 -14 -5 -25 -16 -25 -25 0 -9 -11 -20 -25 -25 -15 -6 -25 -17 -25 -29 0 -11 -9 -23 -20 -26 -18 -6 -20 -15 -20 -78 l0 -72 182 181 c101 100 1228 1225 2506 2500 1278 1276 2328 2321 2333 2322 5 2 9 12 9 23 0 17 -8 19 -99 19 l-98 0 -6 -28z"/>
                        <path
                            d="M7520 8987 c0 -8 -285 -297 -632 -644 -5111 -5091 -5620 -5599 -5661 -5656 -21 -29 -114 -125 -205 -214 -92 -89 -358 -350 -592 -580 -381 -375 -425 -422 -428 -453 -2 -19 -1 -33 2 -30 329 323 7576 7573 7576 7580 0 6 -13 10 -30 10 -18 0 -30 -5 -30 -13z"/>
                        <path
                            d="M7630 8989 c0 -6 -350 -360 -777 -788 -428 -428 -1612 -1614 -2630 -2637 -1019 -1022 -2386 -2393 -3038 -3046 l-1186 -1188 3 -55 3 -56 2390 2382 c2637 2629 5385 5380 5385 5392 0 4 -34 7 -75 7 -47 0 -75 -4 -75 -11z"/>
                        <path
                            d="M7624 6286 c-744 -743 -1869 -1867 -2500 -2498 -632 -631 -1422 -1421 -1756 -1755 -333 -334 -657 -658 -720 -719 -62 -60 -147 -144 -188 -186 -41 -41 -313 -311 -603 -599 -363 -360 -523 -525 -511 -527 18 -4 -24 -45 1799 1770 594 592 1094 1088 1110 1102 17 15 836 831 1820 1814 985 983 1934 1930 2110 2104 176 174 425 425 554 557 129 133 240 241 248 241 7 0 13 11 13 25 0 14 -6 24 -12 24 -7 -1 -621 -609 -1364 -1353z"/>
                        <path
                            d="M7975 6493 c-550 -549 -1729 -1725 -2620 -2613 -891 -889 -2133 -2126 -2760 -2748 l-1139 -1132 39 0 c40 0 52 12 1410 1366 754 752 2428 2424 3720 3715 1293 1292 2356 2349 2363 2349 7 0 12 13 12 30 0 17 -5 30 -12 30 -7 0 -463 -449 -1013 -997z"/>
                        <path
                            d="M4330 5219 c-137 -39 -205 -71 -302 -145 -59 -46 -154 -145 -169 -179 -5 -11 -18 -33 -29 -50 -11 -16 -22 -37 -26 -45 -3 -8 -11 -28 -18 -45 -45 -103 -51 -138 -51 -295 0 -124 4 -166 19 -210 19 -57 42 -114 57 -140 4 -8 19 -35 31 -59 31 -59 135 -170 211 -224 66 -47 206 -117 235 -117 9 0 39 -7 66 -15 66 -20 239 -20 324 1 193 47 384 176 478 325 116 184 155 368 120 574 -7 44 -18 91 -24 105 -5 14 -18 45 -28 70 -52 130 -179 277 -309 357 -162 101 -416 141 -585 92z"/>
                        <path
                            d="M8813 4558 c-92 -94 -226 -228 -297 -297 -412 -403 -2018 -2013 -2013 -2018 4 -3 155 143 337 326 182 182 333 331 336 331 6 0 44 39 44 45 0 5 69 75 74 75 5 0 165 158 1074 1061 331 330 609 599 617 599 9 0 15 10 15 25 0 14 -4 25 -10 25 -5 0 -85 -77 -177 -172z"/>
                        <path
                            d="M6918 2551 c-76 -75 -207 -203 -291 -286 -220 -215 -1431 -1410 -1897 -1872 -323 -321 -390 -393 -370 -393 20 0 296 271 1365 1340 736 736 1337 1341 1335 1343 -3 3 -67 -57 -142 -132z"/>
                        <path
                            d="M6282 2034 c-79 -79 -139 -144 -133 -144 6 0 66 55 133 123 137 136 165 167 152 166 -5 0 -74 -65 -152 -145z"/>
                        <path
                            d="M7895 1080 c-962 -962 -1077 -1080 -1050 -1080 26 0 157 128 1080 1055 578 580 1057 1055 1063 1055 7 0 12 11 12 25 0 14 -6 25 -12 25 -7 0 -499 -486 -1093 -1080z"/>
                        <path
                            d="M7977 1008 c-945 -953 -994 -1003 -964 -1006 29 -3 91 57 996 962 531 531 972 966 979 966 7 0 12 15 12 40 0 27 -4 40 -13 40 -8 0 -462 -451 -1010 -1002z"/>
                        <path
                            d="M6042 1795 c-30 -30 -50 -55 -45 -55 5 0 33 25 63 55 30 30 50 55 45 55 -6 -1 -34 -25 -63 -55z"/>
                    </g>
                </svg>


                <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
                    <li>
                        <Link to={'/faq'} className="dark:text-gray-400">FAQ</Link>
                    </li>
                    <li>
                        <a
                            href={EXTERNAL_URLS.patreon}
                            className="dark:text-gray-400"
                        >
                            Leave me a tip
                        </a>
                    </li>
                    <li>
                        <a
                            href={EXTERNAL_URLS.github}
                            className="dark:text-gray-400"
                        >
                            GitHub
                        </a>
                    </li>
                    <li>
                        <a
                            href={EXTERNAL_URLS.email}
                            className="dark:text-gray-400"
                        >
                            Contact
                        </a>
                    </li>
                </ul>
            </div>
            <p className="block mb-4 text-sm text-center md:mb-0 border-t border-slate-200 mt-4 pt-4 dark:text-gray-400">
                Copyright © {year}&nbsp;
                <a href={EXTERNAL_URLS.benWebsite} target="_blank" rel="noreferrer">Ben Price</a>.
            </p>
        </footer>
    )
}
export default Footer;