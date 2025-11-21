import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"
import { IconCloudUpload, IconMovie, IconX } from "@tabler/icons-react"

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Tiêu đề phải có ít nhất 2 ký tự.",
    }),
    description: z.string().optional(),
    videoFile: z.any().optional(),
    privacy: z.string().min(1, "Vui lòng chọn chế độ hiển thị."),
    channelId: z.string().min(1, "Vui lòng chọn kênh."),
})

export default function CreateVideoPage() {
    const navigate = useNavigate();
    const [channels, setChannels] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            privacy: "public",
        },
    })

    useEffect(() => {
        const fetchChannels = async () => {
            try {
                const dashboardData = await apiClient.getDashboardOverview();
                if (dashboardData?.channels) {
                    setChannels(dashboardData.channels);
                    // Auto-select first channel if available
                    if (dashboardData.channels.length > 0) {
                        form.setValue("channelId", dashboardData.channels[0]._id);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch channels", error);
                toast.error("Không thể tải danh sách kênh.");
            }
        };
        fetchChannels();
    }, [form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            const payload = {
                title: values.title,
                description: values.description,
                channelId: values.channelId,
                // privacy: values.privacy, 
            };

            await apiClient.createVideo(payload);
            toast.success("Video đã được tạo thành công!");
            navigate("/dashboard");
        } catch (error: any) {
            console.error("Create video error", error);
            toast.error(error.message || "Có lỗi xảy ra khi tạo video.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container mx-auto py-8 max-w-5xl">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tải lên video</h1>
                    <p className="text-muted-foreground mt-1">
                        Đăng tải video mới lên kênh của bạn để chia sẻ với mọi người.
                    </p>
                </div>
                <Button variant="outline" onClick={() => navigate("/dashboard")}>
                    <IconX className="mr-2 h-4 w-4" />
                    Hủy bỏ
                </Button>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: File Upload */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>File Video</CardTitle>
                                <CardDescription>
                                    Chọn file video từ máy tính của bạn.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="videoFile"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="flex flex-col items-center justify-center w-full">
                                                    <label
                                                        htmlFor="dropzone-file"
                                                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-900 border-gray-300 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500 transition-colors"
                                                    >
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                                            {fileName ? (
                                                                <>
                                                                    <IconMovie className="w-12 h-12 mb-4 text-red-600" />
                                                                    <p className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                                                                        {fileName}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                        Click để thay đổi file
                                                                    </p>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <IconCloudUpload className="w-12 h-12 mb-4 text-gray-400" />
                                                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                                        <span className="font-semibold">Click để tải lên</span> hoặc kéo thả
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                        MP4, MOV, AVI (Max 2GB)
                                                                    </p>
                                                                </>
                                                            )}
                                                        </div>
                                                        <Input
                                                            id="dropzone-file"
                                                            type="file"
                                                            accept="video/*"
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    field.onChange(e.target.files);
                                                                    setFileName(file.name);
                                                                    // Auto-fill title if empty
                                                                    if (!form.getValues("title")) {
                                                                        form.setValue("title", file.name.replace(/\.[^/.]+$/, ""));
                                                                    }
                                                                }
                                                            }}
                                                            ref={field.ref}
                                                        />
                                                    </label>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">Lưu ý quan trọng</h4>
                            <ul className="text-xs text-blue-700 dark:text-blue-400 list-disc list-inside space-y-1">
                                <li>Không vi phạm bản quyền nội dung.</li>
                                <li>Tuân thủ Nguyên tắc cộng đồng.</li>
                                <li>Đảm bảo chất lượng video tốt nhất.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Column: Metadata Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin chi tiết</CardTitle>
                                <CardDescription>
                                    Cập nhật tiêu đề, mô tả và các cài đặt khác cho video.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="channelId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Đăng lên kênh</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn kênh..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {channels.map((channel) => (
                                                        <SelectItem key={channel._id} value={channel._id}>
                                                            {channel.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tiêu đề (bắt buộc)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nhập tiêu đề video hấp dẫn..." {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Tiêu đề giúp người xem tìm thấy video của bạn.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mô tả</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Giới thiệu về video của bạn..."
                                                    className="min-h-[150px] resize-y"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Mô tả giúp người xem hiểu rõ hơn về nội dung video.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="privacy"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Chế độ hiển thị</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn chế độ..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="public">
                                                        <div className="flex items-center">
                                                            <span className="font-medium">Công khai</span>
                                                            <span className="ml-2 text-muted-foreground text-xs">- Mọi người đều có thể xem</span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="private">
                                                        <div className="flex items-center">
                                                            <span className="font-medium">Riêng tư</span>
                                                            <span className="ml-2 text-muted-foreground text-xs">- Chỉ mình bạn xem được</span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="unlisted">
                                                        <div className="flex items-center">
                                                            <span className="font-medium">Không công khai</span>
                                                            <span className="ml-2 text-muted-foreground text-xs">- Chỉ người có link mới xem được</span>
                                                        </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>
                                Hủy bỏ
                            </Button>
                            <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 min-w-[150px]">
                                {loading ? (
                                    <>
                                        <span className="animate-spin mr-2">⏳</span> Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <IconCloudUpload className="mr-2 h-4 w-4" /> Đăng Video
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}
