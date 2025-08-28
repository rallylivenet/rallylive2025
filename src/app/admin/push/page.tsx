
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdminPushFormSchema, type AdminPushFormValues, type RallyUpdateInput } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Send, Bot } from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AdminPushPage() {
  const { toast } = useToast();
  const [generatedNotification, setGeneratedNotification] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<AdminPushFormValues>({
    resolver: zodResolver(AdminPushFormSchema),
    defaultValues: {
      rallyName: 'Rally Central',
      stageName: 'SS10 Mountain Pass',
      updateType: 'stage_winner',
      stageWinnerDriver: 'J. Smith',
      stageWinnerTime: '08:32.1',
      overallLeaderDriver: '',
      overallLeaderLead: '',
      breakingNews: '',
    },
  });

  const updateType = form.watch('updateType');

  async function onSubmit(data: AdminPushFormValues) {
    setIsSubmitting(true);
    setGeneratedNotification('');
    
    const {
      rallyName,
      stageName,
      updateType,
      stageWinnerDriver,
      stageWinnerTime,
      overallLeaderDriver,
      overallLeaderLead,
      breakingNews,
    } = data;

    const flowInput: RallyUpdateInput = {
      rallyName,
      stageName,
      updateType,
    };

    if (updateType === 'stage_winner' && stageWinnerDriver && stageWinnerTime) {
      flowInput.stageWinner = {
        driverName: stageWinnerDriver,
        time: stageWinnerTime,
      };
    }

    if (updateType === 'overall_leader_change' && overallLeaderDriver && overallLeaderLead) {
      flowInput.overallLeader = {
        driverName: overallLeaderDriver,
        leadBy: overallLeaderLead,
      };
    }

    if (updateType === 'breaking_news' && breakingNews) {
      flowInput.breakingNews = breakingNews;
    }

    try {
      const response = await fetch('/api/generate-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flowInput),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'An unexpected error occurred.');
      }
      
      if (result.notification) {
        setGeneratedNotification(result.notification);
        toast({
          title: 'Notification Generated',
          description: 'The notification message has been created successfully.',
        });
      } else {
        throw new Error('Failed to generate notification.');
      }
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-4">
            <Link href="/">
                <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Button>
            </Link>
        </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center"><Send className="mr-2"/>Push Notification Admin</CardTitle>
          <CardDescription>
            Manually generate and test push notification messages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="rallyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rally Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Rally Finland" {...field} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="stageName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stage Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. SS5 Ouninpohja" {...field} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="updateType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Update Type</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an update type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="stage_winner">Stage Winner</SelectItem>
                          <SelectItem value="overall_leader_change">Overall Leader Change</SelectItem>
                          <SelectItem value="breaking_news">Breaking News</SelectItem>
                          <SelectItem value="rally_start">Rally Start</SelectItem>
                          <SelectItem value="rally_finish">Rally Finish</SelectItem>
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {updateType === 'stage_winner' && (
                <div className="space-y-4 p-4 border rounded-md">
                   <h3 className="font-semibold text-sm">Stage Winner Details</h3>
                   <FormField
                    control={form.control}
                    name="stageWinnerDriver"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Driver Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Driver Name" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="stageWinnerTime"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Stage Time</FormLabel>
                        <FormControl>
                            <Input placeholder="00:00.0" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
              )}

              {updateType === 'overall_leader_change' && (
                <div className="space-y-4 p-4 border rounded-md">
                   <h3 className="font-semibold text-sm">Overall Leader Details</h3>
                    <FormField
                    control={form.control}
                    name="overallLeaderDriver"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>New Leader&apos;s Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Leader Name" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <FormField
                    control={form.control}
                    name="overallLeaderLead"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Lead By</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. 5.2s" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
              )}

               {updateType === 'breaking_news' && (
                <div className="space-y-4 p-4 border rounded-md">
                    <h3 className="font-semibold text-sm">Breaking News Details</h3>
                    <FormField
                    control={form.control}
                    name="breakingNews"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>News Message</FormLabel>
                        <FormControl>
                             <Textarea placeholder="Enter breaking news here..." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
              )}

              <Button type="submit" disabled={isSubmitting} className="w-full">
                <Sparkles className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Generating...' : 'Generate Notification'}
              </Button>
            </form>
          </Form>

           {generatedNotification && (
            <Card className="mt-8 bg-muted">
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                    <Bot className="mr-2"/>
                    Generated Notification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-mono p-4 bg-background rounded-md">{generatedNotification}</p>
                 <Button className="w-full mt-4" onClick={() => toast({ title: 'Sent!', description: 'This would send the push notification to subscribed users.' })}>
                    <Send className="mr-2 h-4 w-4"/>
                    Send Push (Simulated)
                </Button>
              </CardContent>
            </Card>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
