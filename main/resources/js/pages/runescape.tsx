import { H3 } from '@/components/h3';
import { H4 } from '@/components/h4';
import AppLayout from '@/layouts/app-layout';
import {runescape} from '@/routes';
import { type BreadcrumbItem } from '@/types';
import {Head} from '@inertiajs/react';
import {Dot, LoaderCircle, X} from "lucide-react";
import AppLogo from "@/components/app-logo";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Item, ItemActions,
    ItemContent,
    ItemDescription, ItemGroup,
    ItemMedia,
    ItemSeparator,
    ItemTitle
} from "@/components/ui/item";
import {
    Empty,
    EmptyContent,
} from "@/components/ui/empty"
import {useState} from "react";
import {ScrollArea} from "@/components/ui/scroll-area";
import {PredictionGraph} from "@/components/prediction-graph";
import Combobox from "@/components/combobox-12";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Runescape',
        href: runescape().url,
    },
];

export default function Runescape() {
    const [pricePredictPeriod, setPricePredictPeriod] = useState("day1");
    const [averagePricePeriod, setAveragePricePeriod] = useState("day1");
    const [priceRisePeriod, setPriceRisePeriod] = useState("day1");
    const [priceFallPeriod, setPriceFallPeriod] = useState("day1");
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const items: string[] = ["Item 1", "Item 2", "Item 3", "Item 4"];
    const itemValues = [
        { value: '10006', label: 'Red Partyhat' },
        { value: '10007', label: 'Blue Partyhat' },
        { value: '10008', label: 'Green Partyhat' },
    ]
    const data = [
        { date: "2025-12-01", "Item 1": 385, "Item 2": 320, "Item 3": 324, "Item 4": 213 },
        { date: "2025-12-02", "Item 1": 438, "Item 2": 480, "Item 3": 280, "Item 4": 190 },
        { date: "2025-12-03", "Item 1": 155, "Item 2": 200, "Item 3": 310, "Item 4": 245 },
        { date: "2025-12-04", "Item 1": 92, "Item 2": 150, "Item 3": 265, "Item 4": 180 },
        { date: "2025-12-05", "Item 1": 492, "Item 2": 420, "Item 3": 390, "Item 4": 350 },
        { date: "2025-12-06", "Item 1": 81, "Item 2": 130, "Item 3": 175, "Item 4": 160 },
        { date: "2025-12-07", "Item 1": 426, "Item 2": 380, "Item 3": 410, "Item 4": 320 },
        { date: "2025-12-08", "Item 1": 307, "Item 2": 350, "Item 3": 295, "Item 4": 280 },
        { date: "2025-12-09", "Item 1": 371, "Item 2": 310, "Item 3": 340, "Item 4": 290 },
        { date: "2025-12-10", "Item 1": 475, "Item 2": 520, "Item 3": 450, "Item 4": 480 },
        { date: "2025-12-11", "Item 1": 107, "Item 2": 170, "Item 3": 190, "Item 4": 150 },
        { date: "2025-12-12", "Item 1": 341, "Item 2": 290, "Item 3": 315, "Item 4": 270 },
        { date: "2025-12-13", "Item 1": 408, "Item 2": 450, "Item 3": 425, "Item 4": 390 }, // Today
        // Predictions start here
        { date: "2025-12-14", "Item 1": 420, "Item 2": 460, "Item 3": 435, "Item 4": 400 },
        { date: "2025-12-15", "Item 1": 445, "Item 2": 480, "Item 3": 455, "Item 4": 420 },
        { date: "2025-12-16", "Item 1": 390, "Item 2": 440, "Item 3": 415, "Item 4": 380 },
        { date: "2025-12-17", "Item 1": 410, "Item 2": 470, "Item 3": 440, "Item 4": 405 },
        { date: "2025-12-18", "Item 1": 435, "Item 2": 490, "Item 3": 465, "Item 4": 430 },
        { date: "2025-12-19", "Item 1": 380, "Item 2": 430, "Item 3": 405, "Item 4": 370 },
        { date: "2025-12-20", "Item 1": 460, "Item 2": 510, "Item 3": 485, "Item 4": 450 },
    ]

    return (
        <ScrollArea className="h-screen bg-cool-gradient">
            <AppLayout breadcrumbs={breadcrumbs} data-theme="red">
                <Head title="" />
                <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 py-36 bg-transparent">

                    {/*Introduction*/}
                    <div className="text-center flex flex-col items-center justify-center w-full mb-32 gap-4">
                        <div className="flex items-center space-x-2">
                            <AppLogo />
                        </div>
                        <H3 className="text-pretty">
                            AI-Powered Grand Exchange Price Forecasting for <span className="text-sidebar-primary">Runescape 3</span>
                        </H3>

                        {/* Last Update Indicator */}
                        <div className="text-sm space-x-2 text-pretty">
                            Updates daily <Dot className="inline-block align-middle"/>
                            Last updated: {new Date().toLocaleString('en-PH', {
                                year: 'numeric',
                                month: 'short',
                                day: '2-digit',
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true,
                            })}
                        </div>
                    </div>

                    {/*Price Prediction*/}
                    <div className="mt-16 flex justify-between items-center w-full">
                        <div className="flex flex-col gap-1">
                            <H4>Item Trade Price Prediction</H4>
                            <desc className="text-muted-foreground text-sm">See price history and predictions for up to 8 items at once!</desc>
                        </div>
                        <Select
                            value={pricePredictPeriod}
                            onValueChange={setPricePredictPeriod}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Time Period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="day1">Tomorrow</SelectItem>
                                <SelectItem value="day7">Next week</SelectItem>
                                <SelectItem value="day30">Next month</SelectItem>
                                <SelectItem value="day30">Next 3 months</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid auto-rows-min gap-6 md:grid-cols-3 bg-transparent">
                        <Card className="h-148">
                            <CardContent className="flex flex-col gap-6">
                                <Combobox
                                    value={selectedItems}
                                    onValueChange={setSelectedItems}
                                    options={itemValues}
                                />

                                <ScrollArea className="h-121 border rounded-md">
                                    {items.length > 0 ? (
                                        <div className="flex flex-col">
                                            <ItemGroup>
                                                {items.map((item, index) => (
                                                    <>
                                                        <Item>
                                                            <ItemMedia variant="image">
                                                                <img src="https://secure.runescape.com/m=itemdb_rs/1765192585985_obj_sprite.gif?id=1042" alt="oten"/>
                                                            </ItemMedia>
                                                            <ItemContent>
                                                                <ItemTitle>
                                                                    Blue Partyhat
                                                                </ItemTitle>
                                                                <ItemDescription>
                                                                    A nice hat from a cracker.
                                                                </ItemDescription>
                                                            </ItemContent>
                                                            <ItemActions>
                                                                <X className="size-4 hover:text-primary"/>
                                                            </ItemActions>
                                                        </Item>
                                                        {(index !== [1,2,3,4,5,6,7,8,9].length - 1) && <ItemSeparator />}
                                                    </>
                                                ))}
                                            </ItemGroup>
                                        </div>
                                    ) : (
                                        <Empty className="h-121 text-muted-foreground">
                                            <EmptyContent>
                                                No items selected
                                            </EmptyContent>
                                        </Empty>
                                    )}
                                </ScrollArea>
                            </CardContent>
                        </Card>
                        <Card className="md:col-span-2 flex flex-col justify-center">
                            {items.length > 0 ? (
                                <>
                                    <CardHeader>
                                        <CardTitle>Item Price History and Prediction</CardTitle>
                                        <CardDescription>Jan 30 - Apr 30, 2025</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <PredictionGraph data={data} items={items} />
                                    </CardContent>
                                </>
                            ) : (
                                <Empty className="text-muted-foreground">
                                    <EmptyContent>
                                    Select items to predict future prices
                                    </EmptyContent>
                                </Empty>
                            )}
                        </Card>
                    </div>

                    {/*Top Avrg Prices*/}
                    <div className="mt-16 flex justify-between items-center w-full">
                        <div className="flex flex-col gap-1">
                            <H4>Top Average Item Prices</H4>
                            <desc className="text-muted-foreground text-sm">See most valuable traded items by daily price average</desc>
                        </div>
                        <Select
                            value={averagePricePeriod}
                            onValueChange={setAveragePricePeriod}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Time Period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="day1">Today</SelectItem>
                                <SelectItem value="day7">Last week</SelectItem>
                                <SelectItem value="day30">Last month</SelectItem>
                                <SelectItem value="day90">Last 3 months</SelectItem>
                                <SelectItem value="day180">Last 6 months</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid auto-rows-min gap-6 md:grid-cols-3 bg-transparent">
                        <ScrollArea className="h-148">
                            <div className="flex flex-col">
                                <ItemGroup>
                                    {[1,2,3,4,5,6,7,8].map((item, index) => (
                                        <>
                                            <Item className="px-0">
                                                <ItemTitle className="w-8">
                                                    #{index + 1}
                                                </ItemTitle>
                                                <ItemMedia variant="image">
                                                    <img src="https://secure.runescape.com/m=itemdb_rs/1765192585985_obj_sprite.gif?id=1042" alt="oten"/>
                                                </ItemMedia>
                                                <ItemContent>
                                                    <ItemTitle>
                                                        Blue Partyhat
                                                    </ItemTitle>
                                                    <ItemDescription>
                                                        A nice hat from a cracker.
                                                    </ItemDescription>
                                                </ItemContent>
                                                <ItemContent>
                                                    oten
                                                </ItemContent>
                                            </Item>
                                            {(index !== [1,2,3,4,5,6,7,8].length - 1) && <ItemSeparator />}
                                        </>
                                    ))}
                                </ItemGroup>
                            </div>
                        </ScrollArea>
                        <Card className="md:col-span-2 flex flex-col justify-center">
                            <CardHeader>
                                <CardTitle>Item Price History and Prediction</CardTitle>
                                <CardDescription>Jan 30 - Apr 30, 2025</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <PredictionGraph data={data} items={items} />
                            </CardContent>
                        </Card>
                    </div>

                    {/*Top Price Rises*/}
                    <div className="mt-16 flex justify-between items-center w-full">
                        <div className="flex flex-col gap-1">
                            <H4>Top Item Price Rises</H4>
                            <desc className="text-muted-foreground text-sm">See highest price rises by average % increase of total price</desc>
                        </div>
                        <Select
                            value={priceRisePeriod}
                            onValueChange={setPriceRisePeriod}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Time Period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="day1">Today</SelectItem>
                                <SelectItem value="day7">Last week</SelectItem>
                                <SelectItem value="day30">Last month</SelectItem>
                                <SelectItem value="day90">Last 3 months</SelectItem>
                                <SelectItem value="day180">Last 6 months</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid auto-rows-min gap-6 md:grid-cols-3 bg-transparent">
                        <ScrollArea className="h-148">
                            <div className="flex flex-col">
                                <ItemGroup>
                                    {[1,2,3,4,5,6,7,8].map((item, index) => (
                                        <>
                                            <Item className="px-0">
                                                <ItemTitle className="w-8">
                                                    #{index + 1}
                                                </ItemTitle>
                                                <ItemMedia variant="image">
                                                    <img src="https://secure.runescape.com/m=itemdb_rs/1765192585985_obj_sprite.gif?id=1042" alt="oten"/>
                                                </ItemMedia>
                                                <ItemContent>
                                                    <ItemTitle>
                                                        Blue Partyhat
                                                    </ItemTitle>
                                                    <ItemDescription>
                                                        A nice hat from a cracker.
                                                    </ItemDescription>
                                                </ItemContent>
                                                <ItemContent>
                                                    oten
                                                </ItemContent>
                                            </Item>
                                            {(index !== [1,2,3,4,5,6,7,8].length - 1) && <ItemSeparator />}
                                        </>
                                    ))}
                                </ItemGroup>
                            </div>
                        </ScrollArea>
                        <Card className="md:col-span-2 flex flex-col justify-center">
                            <CardHeader>
                                <CardTitle>Item Price History and Prediction</CardTitle>
                                <CardDescription>Jan 30 - Apr 30, 2025</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <PredictionGraph data={data} items={items} />
                            </CardContent>
                        </Card>
                    </div>

                    {/*Top Price Falls*/}
                    <div className="mt-16 flex justify-between items-center w-full">
                        <div className="flex flex-col gap-1">
                            <H4>Top Item Price Falls</H4>
                            <desc className="text-muted-foreground text-sm">See highest price falls by average % decrease of total price</desc>
                        </div>
                        <Select
                            value={priceFallPeriod}
                            onValueChange={setPriceFallPeriod}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Time Period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="day1">Today</SelectItem>
                                <SelectItem value="day7">Last week</SelectItem>
                                <SelectItem value="day30">Last month</SelectItem>
                                <SelectItem value="day90">Last 3 months</SelectItem>
                                <SelectItem value="day180">Last 6 months</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid auto-rows-min gap-6 md:grid-cols-3 bg-transparent">
                        <ScrollArea className="h-148">
                            <div className="flex flex-col">
                                <ItemGroup>
                                    {[1,2,3,4,5,6,7,8].map((item, index) => (
                                        <>
                                            <Item className="px-0">
                                                <ItemTitle className="w-8">
                                                    #{index + 1}
                                                </ItemTitle>
                                                <ItemMedia variant="image">
                                                    <img src="https://secure.runescape.com/m=itemdb_rs/1765192585985_obj_sprite.gif?id=1042" alt="oten"/>
                                                </ItemMedia>
                                                <ItemContent>
                                                    <ItemTitle>
                                                        Blue Partyhat
                                                    </ItemTitle>
                                                    <ItemDescription>
                                                        A nice hat from a cracker.
                                                    </ItemDescription>
                                                </ItemContent>
                                                <ItemContent>
                                                    oten
                                                </ItemContent>
                                            </Item>
                                            {(index !== [1,2,3,4,5,6,7,8].length - 1) && <ItemSeparator />}
                                        </>
                                    ))}
                                </ItemGroup>
                            </div>
                        </ScrollArea>
                        <Card className="md:col-span-2 flex flex-col justify-center">
                            <CardHeader>
                                <CardTitle>Item Price History and Prediction</CardTitle>
                                <CardDescription>Jan 30 - Apr 30, 2025</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <PredictionGraph data={data} items={items} />
                            </CardContent>
                        </Card>
                    </div>

                    {/*Loading State (tangtanga nya after tan)*/}
                    <div className="mt-16 flex justify-between items-center w-full">
                        <div className="flex flex-col gap-1">
                            <H4>Loading State (tangtanga nya after tan)</H4>
                            <desc className="text-muted-foreground text-sm">blablabla blebleble blublublu (naay comments sa code)</desc>
                        </div>
                    </div>

                    <div className="grid auto-rows-min gap-6 md:grid-cols-3 bg-transparent">
                        {/*for the list*/}
                        <Empty className="text-muted-foreground h-148">
                            <EmptyContent className="flex-row gap-2 items-center justify-center">
                                <LoaderCircle className="animate-spin text-primary mb-1"/> Calculating...
                            </EmptyContent>
                        </Empty>

                        <Card className="md:col-span-2 flex flex-col justify-center">
                            {/*only this part for the graph*/}
                            <Empty className="text-muted-foreground">
                                <EmptyContent className="flex-row gap-2 items-center justify-center">
                                    <LoaderCircle className="animate-spin text-primary mb-1"/> Loading price history and predictions...
                                </EmptyContent>
                            </Empty>
                        </Card>
                    </div>
                </div>
            </AppLayout>
        </ScrollArea>
    );
}
