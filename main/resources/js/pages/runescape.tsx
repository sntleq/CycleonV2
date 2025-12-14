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
    const [selectedCategory, setSelectedCategory] = useState<string>();

    const categories = [
        { value: "0", label: "Miscellaneous" },
        { value: "1", label: "Ammo" },
        { value: "2", label: "Arrows" },
        { value: "3", label: "Bolts" },
        { value: "4", label: "Construction materials" },
        { value: "5", label: "Construction products" },
        { value: "6", label: "Cooking ingredients" },
        { value: "7", label: "Costumes" },
        { value: "8", label: "Crafting materials" },
        { value: "9", label: "Familiars" },
        { value: "10", label: "Farming produce" },
        { value: "11", label: "Fletching materials" },
        { value: "12", label: "Food and Drink" },
        { value: "13", label: "Herblore materials" },
        { value: "14", label: "Hunting equipment" },
        { value: "15", label: "Hunting Produce" },
        { value: "16", label: "Jewellery" },
        { value: "17", label: "Mage armour" },
        { value: "18", label: "Mage weapons" },
        { value: "19", label: "Melee armour - low level" },
        { value: "20", label: "Melee armour - mid level" },
        { value: "21", label: "Melee armour - high level" },
        { value: "22", label: "Melee weapons - low level" },
        { value: "23", label: "Melee weapons - mid level" },
        { value: "24", label: "Melee weapons - high level" },
        { value: "25", label: "Mining and Smithing" },
        { value: "26", label: "Potions" },
        { value: "27", label: "Prayer armour" },
        { value: "28", label: "Prayer materials" },
        { value: "29", label: "Range armour" },
        { value: "30", label: "Range weapons" },
        { value: "31", label: "Runecrafting" },
        { value: "32", label: "Runes, Spells and Teleports" },
        { value: "33", label: "Seeds" },
        { value: "34", label: "Summoning scrolls" },
        { value: "35", label: "Tools and containers" },
        { value: "36", label: "Woodcutting product" },
        { value: "37", label: "Pocket items" },
        { value: "38", label: "Stone spirits" },
        { value: "39", label: "Salvage" },
        { value: "40", label: "Firemaking products" },
        { value: "41", label: "Archaeology materials" },
        { value: "42", label: "Wood spirits" },
        { value: "43", label: "Necromancy armour" }
    ]
    const items = [
        { value: '10006', label: 'Red Partyhat' },
        { value: '10007', label: 'Blue Partyhat' },
        { value: '10008', label: 'Green Partyhat' },
        { value: '10009', label: 'Purple Partyhat' },
    ]
    const data = [
        { date: "2025-12-01", "10006": 385, "10007": 320, "10008": 324, "10009": 213 },
        { date: "2025-12-02", "10006": 438, "10007": 480, "10008": 280, "10009": 190 },
        { date: "2025-12-03", "10006": 155, "10007": 200, "10008": 310, "10009": 245 },
        { date: "2025-12-04", "10006": 92, "10007": 150, "10008": 265, "10009": 180 },
        { date: "2025-12-05", "10006": 492, "10007": 420, "10008": 390, "10009": 350 },
        { date: "2025-12-06", "10006": 81, "10007": 130, "10008": 175, "10009": 160 },
        { date: "2025-12-07", "10006": 426, "10007": 380, "10008": 410, "10009": 320 },
        { date: "2025-12-08", "10006": 307, "10007": 350, "10008": 295, "10009": 280 },
        { date: "2025-12-09", "10006": 371, "10007": 310, "10008": 340, "10009": 290 },
        { date: "2025-12-10", "10006": 475, "10007": 520, "10008": 450, "10009": 480 },
        { date: "2025-12-11", "10006": 107, "10007": 170, "10008": 190, "10009": 150 },
        { date: "2025-12-12", "10006": 341, "10007": 290, "10008": 315, "10009": 270 },
        { date: "2025-12-13", "10006": 408, "10007": 450, "10008": 425, "10009": 390 }, // Today
        // Predictions start here
        { date: "2025-12-14", "10006": 420, "10007": 460, "10008": 435, "10009": 400 },
        { date: "2025-12-15", "10006": 445, "10007": 480, "10008": 455, "10009": 420 },
        { date: "2025-12-16", "10006": 390, "10007": 440, "10008": 415, "10009": 380 },
        { date: "2025-12-17", "10006": 410, "10007": 470, "10008": 440, "10009": 405 },
        { date: "2025-12-18", "10006": 435, "10007": 490, "10008": 465, "10009": 430 },
        { date: "2025-12-19", "10006": 380, "10007": 430, "10008": 405, "10009": 370 },
        { date: "2025-12-20", "10006": 460, "10007": 510, "10008": 485, "10009": 450 },
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
                                <Select
                                    value={selectedCategory}
                                    onValueChange={setSelectedCategory}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(category => (
                                            <SelectItem key={category.value} value={category.value}>
                                                {category.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Combobox
                                    value={selectedItems}
                                    onValueChange={setSelectedItems}
                                    options={items}
                                    disabled={!selectedCategory}
                                />

                                <ScrollArea className="h-105 border rounded-md">
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
                            {selectedItems.length > 0 ? (
                                <>
                                    <CardHeader>
                                        <CardTitle>Item Price History and Prediction</CardTitle>
                                        <CardDescription>Jan 30 - Apr 30, 2025</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <PredictionGraph data={data} items={items.filter(i => selectedItems.includes(i.value))} />
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
                                <PredictionGraph data={data} items={items.filter(i => selectedItems.includes(i.value))} />
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
                                <PredictionGraph data={data} items={items.filter(i => selectedItems.includes(i.value))} />
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
                                <PredictionGraph data={data} items={items.filter(i => selectedItems.includes(i.value))} />
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
