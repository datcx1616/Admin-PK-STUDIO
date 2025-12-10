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
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"
import {
    IconCloudUpload,
    IconMovie,
    IconX,
    IconHash,
    IconAlertCircle,
} from "@tabler/icons-react"

const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB
const ACCEPTED_VIDEO_TYPES = [
    "video/mp4",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-matroska",
    "video/webm"
];

const formSchema = z.object({
    title: z.string()
        .min(2, "Tiêu đề phải có ít nhất 2 ký tự.")
        .max(100, "Tiêu đề không được vượt quá 100 ký tự."),
    description: z.string()
        .max(5000, "Mô tả không được vượt quá 5000 ký tự.")
        .optional(),
    videoFile: z
        .any()
        .refine((file) => file?.length > 0, "Vui lòng chọn file video.")
        .refine(
            (file) => file?.[0]?.size <= MAX_FILE_SIZE,
            "File video không được vượt quá 2GB."
        )
        .refine(
            (file) => ACCEPTED_VIDEO_TYPES.includes(file?.[0]?.type),
            "Chỉ chấp nhận file video định dạng MP4, MOV, AVI, MKV, WEBM."
        ),
    privacy: z.string().min(1, "Vui lòng chọn chế độ hiển thị."),
    channelId: z.string().min(1, "Vui lòng chọn kênh."),
    tags: z.array(z.string()).optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function VideoUploadPage() {
    const navigate = useNavigate();
    const [channels, setChannels] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [fileName, setFileName] = useState<string | null>(null);
    const [fileSize, setFileSize] = useState<number>(0);
    const [videoDuration, setVideoDuration] = useState<string | null>(null);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            privacy: "public",
            tags: [],
        },
    })

    useEffect(() => {
        const fetchChannels = async () => {
            try {
                console.log('🔄 Fetching channels for video upload...');
                const response = await apiClient.getChannels();
                console.log('✅ Channels API response:', response);

                const channelsList = response?.data?.channels || response?.channels || response?.data || [];
                console.log('📊 Extracted channels:', channelsList);

                const connectedChannels = Array.isArray(channelsList)
                    ? channelsList.filter((ch) => ch.isConnected)
                    : [];

                console.log('✅ Connected channels:', connectedChannels.length);
                setChannels(connectedChannels);

                if (connectedChannels.length === 1) {
                    form.setValue("channelId", connectedChannels[0]._id);
                    console.log('✅ Auto-selected channel:', connectedChannels[0].name);
                } else if (connectedChannels.length === 0) {
                    console.warn('⚠️ No connected channels found');
                    toast.warning("Bạn chưa có kênh nào được kết nối để tải video.");
                }
            } catch (error) {
                console.error("❌ Failed to fetch channels:", error);
                const errorMessage = error instanceof Error ? error.message : "Không thể tải danh sách kênh.";
                toast.error(errorMessage);
            }
        };
        fetchChannels();
    }, [form]); const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            setFileSize(file.size);

            if (!form.getValues("title")) {
                const titleFromFile = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
                form.setValue("title", titleFromFile);
            }

            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = function () {
                const duration = video.duration;
                const minutes = Math.floor(duration / 60);
                const seconds = Math.floor(duration % 60);
                setVideoDuration(`${minutes}:${seconds.toString().padStart(2, '0')}`);
            }
            video.src = URL.createObjectURL(file);
        }
    };

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                const newTags = [...tags, tagInput.trim()];
                setTags(newTags);
                form.setValue('tags', newTags);
            }
            setTagInput("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        const newTags = tags.filter(tag => tag !== tagToRemove);
        setTags(newTags);
        form.setValue('tags', newTags);
    };

    async function onSubmit(values: FormValues) {
        setLoading(true);
        setUploadProgress(0);

        try {
            console.log('🎬 Starting video upload process...');
            console.log('📋 Upload data:', {
                title: values.title,
                channelId: values.channelId,
                privacy: values.privacy,
                tags: tags,
                fileSize: values.videoFile[0].size,
                fileName: values.videoFile[0].name
            });

            const formData = new FormData();
            formData.append('file', values.videoFile[0]);
            formData.append('title', values.title);
            formData.append('description', values.description || '');
            formData.append('channelId', values.channelId);
            formData.append('tags', JSON.stringify(tags));
            formData.append('privacy', values.privacy);

            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return prev;
                    }
                    return prev + 10;
                });
            }, 500);


            console.log('📤 Calling upload API...');
            const result = await apiClient.uploadVideo(formData);
            console.log('✅ Upload API response:', result);

            clearInterval(progressInterval);
            setUploadProgress(100);

            toast.success("Video đã được tải lên thành công!");

            setTimeout(() => {
                navigate("/videos/my");
            }, 1500);

        } catch (error) {
            console.error("❌ Upload video error:", error);
            let errorMessage = "Có lỗi xảy ra khi tải video lên.";

            if (error instanceof Error) {
                errorMessage = error.message;

                if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                    errorMessage = "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc liên hệ quản trị viên.";
                } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
                    errorMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
                } else if (error.message.includes('413') || error.message.includes('too large')) {
                    errorMessage = "File video quá lớn. Vui lòng chọn file nhỏ hơn 2GB.";
                } else if (error.message.includes('400') || error.message.includes('Bad Request')) {
                    errorMessage = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.";
                }
            }

            toast.error(errorMessage, {
                duration: 5000,
            });
            setUploadProgress(0);
        } finally {
            setLoading(false);
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="container mx-auto py-8 max-w-6xl">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tải lên video</h1>
                    <p className="text-muted-foreground mt-1">
                        Đăng tải video mới lên kênh YouTube của bạn
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => navigate("/videos/my")}
                    disabled={loading}
                >
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
                                    Chọn file video từ máy tính của bạn
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="videoFile"
                                    render={({ field: { onChange, ref } }) => (
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
                                                                    <IconMovie className="w-10 h-10 mb-3 text-gray-400" />
                                                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                                        <span className="font-semibold">{fileName}</span>
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                        {formatFileSize(fileSize)}
                                                                        {videoDuration && ` • ${videoDuration}`}
                                                                    </p>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <IconCloudUpload className="w-10 h-10 mb-3 text-gray-400" />
                                                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                                        <span className="font-semibold">Click để chọn</span> hoặc kéo thả
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                        MP4, MOV, AVI, MKV, WEBM (tối đa 2GB)
                                                                    </p>
                                                                </>
                                                            )}
                                                        </div>
                                                        <input
                                                            id="dropzone-file"
                                                            type="file"
                                                            className="hidden"
                                                            accept="video/*"
                                                            onChange={(e) => {
                                                                onChange(e.target.files);
                                                                handleFileSelect(e);
                                                            }}
                                                            ref={ref}
                                                            disabled={loading}
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

                        {uploadProgress > 0 && (
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm">Tiến trình tải lên</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Progress value={uploadProgress} className="mb-2" />
                                    <p className="text-sm text-center text-muted-foreground">
                                        {uploadProgress}%
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                            <div className="flex items-start gap-2">
                                <IconAlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">
                                        Lưu ý quan trọng
                                    </h4>
                                    <ul className="text-xs text-blue-700 dark:text-blue-400 list-disc list-inside space-y-1">
                                        <li>Không vi phạm bản quyền nội dung</li>
                                        <li>Tuân thủ Nguyên tắc cộng đồng YouTube</li>
                                        <li>Video sẽ được Manager duyệt trước khi xuất bản</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Metadata Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin chi tiết</CardTitle>
                                <CardDescription>
                                    Cập nhật tiêu đề, mô tả và các cài đặt khác cho video
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Channel Selection */}
                                <FormField
                                    control={form.control}
                                    name="channelId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kênh YouTube</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="text-gray-900">
                                                        <SelectValue placeholder="Chọn kênh để đăng video" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className=" dark:bg-gray-800">
                                                    {channels.map((channel) => (
                                                        <SelectItem
                                                            key={channel._id}
                                                            value={channel._id}
                                                            className="text-gray-900 cursor-pointer dark:hover:bg-gray-700"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <img
                                                                    src={channel.snippet?.thumbnails?.default?.url}
                                                                    alt={channel.snippet?.title}
                                                                    className="w-6 h-6 rounded-full"
                                                                />
                                                                <span>{channel.snippet?.title}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Chọn kênh YouTube để đăng video này
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Title */}
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Tiêu đề <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Nhập tiêu đề cho video của bạn"
                                                    {...field}
                                                    disabled={loading}
                                                    maxLength={100}
                                                />
                                            </FormControl>
                                            <div className="flex justify-between">
                                                <FormDescription>
                                                    Tiêu đề hấp dẫn giúp người xem tìm thấy video của bạn
                                                </FormDescription>
                                                <span className="text-xs text-muted-foreground">
                                                    {field.value?.length || 0}/100
                                                </span>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Description */}
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mô tả</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Mô tả nội dung video của bạn"
                                                    className="resize-none min-h-[120px]"
                                                    {...field}
                                                    disabled={loading}
                                                    maxLength={5000}
                                                />
                                            </FormControl>
                                            <div className="flex justify-between">
                                                <FormDescription>
                                                    Mô tả chi tiết giúp video được tìm thấy dễ dàng hơn
                                                </FormDescription>
                                                <span className="text-xs text-muted-foreground">
                                                    {field.value?.length || 0}/5000
                                                </span>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Tags */}
                                <div className="space-y-2">
                                    <FormLabel>Thẻ (Tags)</FormLabel>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Nhập thẻ và nhấn Enter"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={handleAddTag}
                                            disabled={loading || tags.length >= 10}
                                        />
                                        {tags.length < 10 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
                                                        const newTags = [...tags, tagInput.trim()];
                                                        setTags(newTags);
                                                        form.setValue('tags', newTags);
                                                        setTagInput("");
                                                    }
                                                }}
                                                disabled={!tagInput.trim()}
                                            >
                                                Thêm
                                            </Button>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {tags.map((tag, index) => (
                                            <Badge
                                                key={index}
                                                variant="secondary"
                                                className="pl-2 pr-1 py-1"
                                            >
                                                <IconHash className="h-3 w-3 mr-1" />
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveTag(tag)}
                                                    className="ml-2 hover:text-destructive"
                                                    disabled={loading}
                                                >
                                                    <IconX className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                    <FormDescription>
                                        Thêm thẻ để giúp người xem tìm thấy video của bạn (tối đa 10 thẻ)
                                    </FormDescription>
                                </div>

                                {/* Privacy */}
                                <FormField
                                    control={form.control}
                                    name="privacy"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Chế độ hiển thị</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="text-gray-900 dark:text-gray-100">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="bg-white dark:bg-gray-800">
                                                    <SelectItem value="public" className="text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                                                        <div className="flex items-center">
                                                            <span className="font-medium">Công khai</span>
                                                            <span className="ml-2 text-gray-500 dark:text-gray-400 text-xs">
                                                                - Mọi người đều có thể xem
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="private" className="text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                                                        <div className="flex items-center">
                                                            <span className="font-medium">Riêng tư</span>
                                                            <span className="ml-2 text-gray-500 dark:text-gray-400 text-xs">
                                                                - Chỉ bạn và người được mời
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="unlisted" className="text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                                                        <div className="flex items-center">
                                                            <span className="font-medium">Không công khai</span>
                                                            <span className="ml-2 text-gray-500 dark:text-gray-400 text-xs">
                                                                - Chỉ người có link mới xem được
                                                            </span>
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
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/videos/my")}
                                disabled={loading}
                            >
                                Hủy bỏ
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading || !fileName}
                                className="bg-red-600 hover:bg-red-700 min-w-[150px]"
                            >
                                {loading ? (
                                    <>
                                        <span className="animate-spin mr-2">⏳</span>
                                        Đang tải lên... {uploadProgress}%
                                    </>
                                ) : (
                                    <>
                                        <IconCloudUpload className="mr-2 h-4 w-4" />
                                        Tải lên video
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