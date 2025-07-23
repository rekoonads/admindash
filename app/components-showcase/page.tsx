"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Typography } from "@/components/ui/typography";
import { DatePicker } from "@/components/ui/date-picker";
import { Combobox } from "@/components/ui/combobox";
import { toast } from "sonner";
import { Settings, User } from "lucide-react";

export default function ComponentsShowcasePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [comboboxValue, setComboboxValue] = useState("");

  const comboboxOptions = [
    { value: "next.js", label: "Next.js" },
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "angular", label: "Angular" },
    { value: "svelte", label: "Svelte" },
  ];

  const invoices = [
    {
      invoice: "INV001",
      paymentStatus: "Paid",
      totalAmount: "$250.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV002",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV003",
      paymentStatus: "Unpaid",
      totalAmount: "$350.00",
      paymentMethod: "Bank Transfer",
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <Typography.h1 className="mb-8">
        Shadcn/ui Components Showcase
      </Typography.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Alert Dialog */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Dialog</CardTitle>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">Show Dialog</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        {/* Aspect Ratio */}
        <Card>
          <CardHeader>
            <CardTitle>Aspect Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <AspectRatio ratio={16 / 9} className="bg-muted">
              <img
                src="/placeholder.svg?height=200&width=350"
                alt="Placeholder"
                className="rounded-md object-cover w-full h-full"
              />
            </AspectRatio>
          </CardContent>
        </Card>

        {/* Badge */}
        <Card>
          <CardHeader>
            <CardTitle>Badge</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </CardContent>
        </Card>

        {/* Button */}
        <Card>
          <CardHeader>
            <CardTitle>Button</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Checkbox */}
        <Card>
          <CardHeader>
            <CardTitle>Checkbox</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">Accept terms and conditions</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="marketing" />
              <Label htmlFor="marketing">Send me marketing emails</Label>
            </div>
          </CardContent>
        </Card>

        {/* Combobox */}
        <Card>
          <CardHeader>
            <CardTitle>Combobox</CardTitle>
          </CardHeader>
          <CardContent>
            <Combobox
              options={comboboxOptions}
              value={comboboxValue}
              onValueChange={setComboboxValue}
              placeholder="Select framework..."
            />
          </CardContent>
        </Card>

        {/* Command */}
        <Card>
          <CardHeader>
            <CardTitle>Command</CardTitle>
          </CardHeader>
          <CardContent>
            <Command className="rounded-lg border shadow-md">
              <CommandInput placeholder="Type a command or search..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                  <CommandItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </CommandItem>
                  <CommandItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </CardContent>
        </Card>

        {/* Context Menu */}
        <Card>
          <CardHeader>
            <CardTitle>Context Menu</CardTitle>
          </CardHeader>
          <CardContent>
            <ContextMenu>
              <ContextMenuTrigger className="flex h-[150px] w-full items-center justify-center rounded-md border border-dashed text-sm">
                Right click here
              </ContextMenuTrigger>
              <ContextMenuContent className="w-64">
                <ContextMenuItem>
                  Back
                  <ContextMenuShortcut>⌘[</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem disabled>
                  Forward
                  <ContextMenuShortcut>⌘]</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem>
                  Reload
                  <ContextMenuShortcut>⌘R</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuCheckboxItem checked>
                  Show Bookmarks Bar
                </ContextMenuCheckboxItem>
                <ContextMenuSeparator />
                <ContextMenuRadioGroup value="pedro">
                  <ContextMenuLabel>People</ContextMenuLabel>
                  <ContextMenuSeparator />
                  <ContextMenuRadioItem value="pedro">
                    Pedro Duarte
                  </ContextMenuRadioItem>
                  <ContextMenuRadioItem value="colm">
                    Colm Tuite
                  </ContextMenuRadioItem>
                </ContextMenuRadioGroup>
              </ContextMenuContent>
            </ContextMenu>
          </CardContent>
        </Card>

        {/* Date Picker */}
        <Card>
          <CardHeader>
            <CardTitle>Date Picker</CardTitle>
          </CardHeader>
          <CardContent>
            <DatePicker date={date} onDateChange={setDate} />
          </CardContent>
        </Card>

        {/* Dialog */}
        <Card>
          <CardHeader>
            <CardTitle>Dialog</CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Edit Profile</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're
                    done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value="Pedro Duarte"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Username
                    </Label>
                    <Input
                      id="username"
                      value="@peduarte"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Dropdown Menu */}
        <Card>
          <CardHeader>
            <CardTitle>Dropdown Menu</CardTitle>
          </CardHeader>
          <CardContent>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Open</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>

        {/* Input */}
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input placeholder="Email" />
            <Input type="password" placeholder="Password" />
            <Input disabled placeholder="Disabled" />
          </CardContent>
        </Card>

        {/* Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={66} className="w-full" />
          </CardContent>
        </Card>

        {/* Radio Group */}
        <Card>
          <CardHeader>
            <CardTitle>Radio Group</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup defaultValue="comfortable">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="r1" />
                <Label htmlFor="r1">Default</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="comfortable" id="r2" />
                <Label htmlFor="r2">Comfortable</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="compact" id="r3" />
                <Label htmlFor="r3">Compact</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Scroll Area */}
        <Card>
          <CardHeader>
            <CardTitle>Scroll Area</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              <div className="p-4">
                <Typography.h4 className="mb-4">Tags</Typography.h4>
                {Array.from({ length: 50 })
                  .map((_, i, a) => `v0.dev/tag/${a.length - i}`)
                  .map((tag) => (
                    <div key={tag}>
                      <div className="text-sm">{tag}</div>
                      <Separator className="my-2" />
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Select */}
        <Card>
          <CardHeader>
            <CardTitle>Select</CardTitle>
          </CardHeader>
          <CardContent>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>Skeleton</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Slider */}
        <Card>
          <CardHeader>
            <CardTitle>Slider</CardTitle>
          </CardHeader>
          <CardContent>
            <Slider defaultValue={[50]} max={100} step={1} className="w-full" />
          </CardContent>
        </Card>

        {/* Switch */}
        <Card>
          <CardHeader>
            <CardTitle>Switch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="airplane-mode" />
              <Label htmlFor="airplane-mode">Airplane Mode</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="notifications" />
              <Label htmlFor="notifications">Notifications</Label>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Tabs</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="account" className="w-[400px]">
              <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                Make changes to your account here.
              </TabsContent>
              <TabsContent value="password">
                Change your password here.
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Textarea */}
        <Card>
          <CardHeader>
            <CardTitle>Textarea</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea placeholder="Type your message here." />
          </CardContent>
        </Card>

        {/* Toggle */}
        <Card>
          <CardHeader>
            <CardTitle>Toggle</CardTitle>
          </CardHeader>
          <CardContent>
            <Toggle aria-label="Toggle italic">
              <User className="h-4 w-4" />
            </Toggle>
          </CardContent>
        </Card>

        {/* Toggle Group */}
        <Card>
          <CardHeader>
            <CardTitle>Toggle Group</CardTitle>
          </CardHeader>
          <CardContent>
            <ToggleGroup type="multiple">
              <ToggleGroupItem value="bold" aria-label="Toggle bold">
                B
              </ToggleGroupItem>
              <ToggleGroupItem value="italic" aria-label="Toggle italic">
                I
              </ToggleGroupItem>
              <ToggleGroupItem value="underline" aria-label="Toggle underline">
                U
              </ToggleGroupItem>
            </ToggleGroup>
          </CardContent>
        </Card>

        {/* Toast */}
        <Card>
          <CardHeader>
            <CardTitle>Toast</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={() =>
                toast("Event has been created", {
                  description: "Sunday, December 03, 2023 at 9:00 AM",
                  action: {
                    label: "Undo",
                    onClick: () => console.log("Undo!"),
                  },
                })
              }
            >
              Show Toast
            </Button>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Table</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Invoice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.invoice}>
                    <TableCell className="font-medium">
                      {invoice.invoice}
                    </TableCell>
                    <TableCell>{invoice.paymentStatus}</TableCell>
                    <TableCell>{invoice.paymentMethod}</TableCell>
                    <TableCell className="text-right">
                      {invoice.totalAmount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Typography</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Typography.h1>
              The quick brown fox jumps over the lazy dog.
            </Typography.h1>
            <Typography.h2>
              The quick brown fox jumps over the lazy dog.
            </Typography.h2>
            <Typography.h3>
              The quick brown fox jumps over the lazy dog.
            </Typography.h3>
            <Typography.h4>
              The quick brown fox jumps over the lazy dog.
            </Typography.h4>
            <Typography.p>
              The quick brown fox jumps over the lazy dog.
            </Typography.p>
            <Typography.blockquote>
              "The quick brown fox jumps over the lazy dog."
            </Typography.blockquote>
            <Typography.ul>
              <li>First item</li>
              <li>Second item</li>
              <li>Third item</li>
            </Typography.ul>
            <Typography.inlineCode>
              console.log("Hello, world!")
            </Typography.inlineCode>
            <Typography.lead>
              The quick brown fox jumps over the lazy dog.
            </Typography.lead>
            <Typography.large>
              The quick brown fox jumps over the lazy dog.
            </Typography.large>
            <Typography.small>
              The quick brown fox jumps over the lazy dog.
            </Typography.small>
            <Typography.muted>
              The quick brown fox jumps over the lazy dog.
            </Typography.muted>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
