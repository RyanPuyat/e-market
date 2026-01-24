'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { reviewFormDefaultValues } from '@/lib/constants';
import { insertReviewSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { SelectTrigger } from '@/components/ui/select';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { StarIcon } from 'lucide-react';
import { createUpdateReview } from '@/lib/actions/review.actions';

function ReviewForm({
  userId,
  productId,
  onReviewSubmitted,
}: {
  userId: string;
  productId: string;
  onReviewSubmitted: () => void;
}) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof insertReviewSchema>>({
    resolver: zodResolver(insertReviewSchema),
    defaultValues: reviewFormDefaultValues,
  });

  //Open form handler

  const handleOpenForm = () => {
    form.setValue('productId', productId);
    form.setValue('userId', userId);

    setOpen(true);
  };

  //Submit Form handler
  const onSubmit: SubmitHandler<z.infer<typeof insertReviewSchema>> = async (
    values,
  ) => {
    const res = await createUpdateReview({ ...values, productId });

    if (!res.success) {
      return toast.success(res.message);
    }

    setOpen(false);
    onReviewSubmitted();

    toast.success(res.message);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={handleOpenForm} variant="default">
        Write a review
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form method="post" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Write a review</DialogTitle>
              <DialogDescription>
                Share your thoughts with other customers
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter description" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    {/* <Select
                      onValueChange={(val)} => {field.onChange(Number(val))}
                      value={field.value?.toString()}
                    > */}
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))} // ✅ convert to number
                      value={field.value?.toString()} // keep string for Select UI
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 5 }).map((_, index) => (
                          <SelectItem
                            key={index}
                            value={(index + 1).toString()}
                          >
                            {index + 1}
                            <StarIcon className="inline h-4 w-4" />
                          </SelectItem>
                        ))}
                      </SelectContent>
                      <FormMessage />
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default ReviewForm;
