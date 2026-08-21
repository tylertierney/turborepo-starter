import {
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
  Input,
  toast,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@repo/ui'
import { useForm } from '@tanstack/react-form'
import * as z from 'zod'
import { useMutation } from '@tanstack/react-query'
import {
  Link,
  LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
} from 'react-router'
import { Invitation, Practice } from '@repo/models'
import { ArrowUpRightIcon, Building } from 'lucide-react'
import { api } from '../../../api'
import axios from 'axios'
import { authClient } from '../../../auth-client'

export const signUpLoader = async ({ params }: LoaderFunctionArgs) => {
  const { invitationId } = params

  try {
    const res = await fetch(`/api/invitations/${invitationId}`)
    if (!res.ok) {
      throw new Error()
    }
    const json = await res.json()
    return json
  } catch (err) {
    toast.add({
      type: 'error',
      title: 'Error',
      description: 'No invitation was found',
    })
    return null
  }
}

export type FormValues = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

const nameValidator = (value: string) => {
  const res = z
    .string()
    .min(2, { message: 'Field must be at least 2 characters' })
    .max(35, { message: 'Field must be at most 35 characters' })
    .safeParse(value)

  return res.success ? [] : res.error.issues.map((issue) => issue.message)
}

const passwordValidator = (value: string) => {
  const res = z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' })
    .max(256, { message: 'Password is too long.' })
    .safeParse(value)

  return res.success ? [] : res.error.issues.map((issue) => issue.message)
}

export const SignUp = () => {
  const invitation = useLoaderData() as Invitation
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      firstName: invitation?.firstName,
      lastName: invitation?.lastName,
      email: invitation?.email,
      password: '',
      confirmPassword: '',
    } satisfies FormValues,
  })

  const { mutate: submit, isPending } = useMutation({
    mutationKey: ['signup-submission'],
    mutationFn: async () => {
      if (!form.state.isValid) return

      const { data } = await api.post(
        `/api/invitations/${invitation.id}/accept`,
        {
          firstName: form.state.values.firstName,
          lastName: form.state.values.lastName,
          password: form.state.values.confirmPassword,
        },
      )

      return data
    },
    onError: (err) => {
      toast.add({
        type: 'error',
        title: 'Error',
        description: axios.isAxiosError(err)
          ? err.response?.data?.message || 'Something went wrong'
          : 'Something went wrong',
      })
    },
    onSuccess: async () => {
      toast.add({
        type: 'success',
        title: 'Success',
        description: 'Successfully created a user',
      })
      const res = await authClient.signIn.email({
        email: form.state.values.email,
        password: form.state.values.password,
      })

      if (!res || res.error) {
        toast.add({
          type: 'error',
          title: 'Error',
          description: 'Error signing in to your new account.',
        })
        navigate('/login')
        return
      }

      navigate('/app')
    },
  })

  if (!invitation || !invitation.practice || Boolean(invitation.consumedAt)) {
    return (
      <Empty className="mt-72">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Building />
          </EmptyMedia>
          <EmptyTitle>No invitation exists here</EmptyTitle>
          <EmptyDescription>
            An invitation from an active practice is required in order to sign
            up. Double check the invitation link.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            variant="link"
            className="text-muted-foreground"
            size="sm"
            nativeButton={false}
            render={
              <a>
                Or contact support <ArrowUpRightIcon />
              </a>
            }
          />
        </EmptyContent>
      </Empty>
    )
  }

  const practiceDetails = (practice: Practice) => {
    const { image, name } = practice

    return (
      <div className="flex flex-col items-center gap-6 my-10">
        {image && <img className="w-72 h-72" src={image} />}
        <h1 className="text-2xl align-middle font-bold">{name}</h1>
        <p className="text-center">
          Invites you to join their practice as a member.
          <br />
          Get started by verifying a few details for us.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center p-4">
      {invitation.practice ? practiceDetails(invitation.practice) : null}
      <form
        className="flex w-full max-w-md flex-col"
        onSubmit={async (e) => {
          e.preventDefault()

          submit()
        }}
      >
        <FieldGroup>
          <FieldSet className="gap-6 mb-6">
            <FieldGroup>
              <Field>
                <form.Field
                  name="firstName"
                  validators={{
                    onChange: ({ value }) => nameValidator(value),
                  }}
                  children={(f) => {
                    const errors = f.state.meta.errors
                    const isInvalid = !f.state.meta.isValid && errors.length > 0
                    return (
                      <>
                        <FieldLabel htmlFor="firstName">
                          <span className="text-destructive">*</span>
                          First Name
                        </FieldLabel>
                        <Input
                          id="firstName"
                          placeholder="John"
                          onChange={(e) => f.handleChange(e.target.value)}
                          onBlur={f.handleBlur}
                          aria-invalid={isInvalid}
                          value={f.state.value}
                          disabled={isPending}
                        />
                        {isInvalid &&
                          errors.map((err, idx) => (
                            <FieldError key={idx}>{err}</FieldError>
                          ))}
                      </>
                    )
                  }}
                />
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field>
                <form.Field
                  name="lastName"
                  validators={{
                    onChange: ({ value }) => nameValidator(value),
                  }}
                  children={(f) => {
                    const errors = f.state.meta.errors
                    const isInvalid = !f.state.meta.isValid && errors.length > 0
                    return (
                      <>
                        <FieldLabel htmlFor="lastName">
                          <span className="text-destructive">*</span>
                          Last Name
                        </FieldLabel>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          onChange={(e) => f.handleChange(e.target.value)}
                          onBlur={f.handleBlur}
                          aria-invalid={isInvalid}
                          value={f.state.value}
                          disabled={isPending}
                        />
                        {isInvalid &&
                          errors.map((err, idx) => (
                            <FieldError key={idx}>{err}</FieldError>
                          ))}
                      </>
                    )
                  }}
                />
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field>
                <form.Field
                  name="email"
                  children={(f) => {
                    return (
                      <>
                        <FieldLabel htmlFor="email">
                          <span className="text-destructive">*</span>
                          Email
                        </FieldLabel>
                        <Tooltip>
                          <TooltipTrigger>
                            <Input
                              id="email"
                              type="email"
                              placeholder="johndoe@email.com"
                              onBlur={f.handleBlur}
                              value={f.state.value}
                              disabled={true}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            Email address is provided by your practice.
                          </TooltipContent>
                        </Tooltip>
                      </>
                    )
                  }}
                />
              </Field>
            </FieldGroup>
            <FieldSeparator />
            <FieldGroup>
              <Field>
                <form.Field
                  name="password"
                  validators={{
                    onChange: ({ value }) => passwordValidator(value),
                    onMount: ({ value }) => passwordValidator(value),
                  }}
                  children={(f) => {
                    const errors = f.state.meta.errors
                    const isInvalid =
                      !f.state.meta.isValid &&
                      f.state.meta.isDirty &&
                      errors.length > 0
                    return (
                      <>
                        <FieldLabel htmlFor="password">
                          <span className="text-destructive">*</span>
                          Password
                        </FieldLabel>
                        <Input
                          id="password"
                          placeholder=""
                          type="password"
                          onChange={(e) => f.handleChange(e.target.value)}
                          onBlur={f.handleBlur}
                          aria-invalid={isInvalid}
                          value={f.state.value}
                          disabled={isPending}
                        />
                        {isInvalid &&
                          errors.map((err, idx) => (
                            <FieldError key={idx}>{err}</FieldError>
                          ))}
                      </>
                    )
                  }}
                />
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field>
                <form.Field
                  name="confirmPassword"

                  validators={{
                    onChangeListenTo: ['password'],
                    onChange: ({ value, fieldApi }) => {
                      if (value !== fieldApi.form.getFieldValue('password')) {
                        return ['Passwords do not match']
                      }
                      return passwordValidator(value)
                    },
                  }}
                  children={(f) => {
                    const errors = f.state.meta.errors
                    const isInvalid =
                      !f.state.meta.isValid &&
                      errors.length > 0 &&
                      f.state.meta.isDirty
                    return (
                      <>
                        <FieldLabel htmlFor="confirmPassword">
                          <span className="text-destructive">*</span>
                          Confirm Password
                        </FieldLabel>
                        <Input
                          id="confirmPassword"
                          placeholder=""
                          type="password"
                          onChange={(e) => f.handleChange(e.target.value)}
                          onBlur={f.handleBlur}
                          aria-invalid={isInvalid}
                          value={f.state.value}
                          disabled={isPending}
                        />
                        {isInvalid &&
                          errors.map((err, idx) => (
                            <FieldError key={idx}>{err}</FieldError>
                          ))}
                      </>
                    )
                  }}
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          <Field orientation="vertical" className="gap-2">
            <form.Subscribe
              selector={(form) => ({
                isPristine: form.isPristine,
                valid: form.isValid,
              })}
              children={({ valid, isPristine }) => (
                <Button
                  disabled={!valid || isPristine || isPending}
                  type="submit"
                  className="w-full py-6 mb-4"
                >
                  Submit
                </Button>
              )}
            />

            <Button
              disabled={isPending}
              variant="outline"
              type="button"
              className="w-full py-6"
              nativeButton={false}
              render={<Link to="/">Cancel</Link>}
            />
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
